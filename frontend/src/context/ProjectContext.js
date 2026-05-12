import React, {
  createContext,
  useContext,
  useState
} from 'react';

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {

  const [resumes, setResumes] = useState([]);

  const [jobDescription, setJobDescription] = useState('');

  const [rankings, setRankings] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  // ADD RESUMES
  const addResumes = async (newFiles) => {

    setError(null);

    const stagedResumes = newFiles.map(file => ({
      id: crypto.randomUUID(),
      file,
      name: file.name,
      size: file.size ? `${(file.size / 1024).toFixed(2)} KB` : '0 KB',
      type: file.type,
      uploadedAt: new Date().toISOString(),
      status: 'Staged'
    }));

    setResumes(prev => [
      ...prev,
      ...stagedResumes
    ]);
  };

  // UPLOAD STAGED RESUMES
  const uploadStagedResumes = async () => {
    const stagedResumes = resumes.filter(resume => !resume.resume_id);

    if (stagedResumes.length === 0) {
      return true;
    }

    setLoading(true);
    setError(null);

    try {
      const updatedResumes = [...resumes];

      for (const resume of stagedResumes) {
        const formData = new FormData();
        formData.append('file', resume.file);

        const response = await fetch(
          'http://127.0.0.1:8000/upload-resume',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
          }
        );

        const data = await response.json();

        if (data.error) {
          setError(data.error);
          return false;
        }

        const idx = updatedResumes.findIndex(item => item.id === resume.id);
        if (idx !== -1) {
          updatedResumes[idx] = {
            ...updatedResumes[idx],
            resume_id: data.resume_id,
            status: 'Uploaded'
          };
        }
      }

      setResumes(updatedResumes);
      return true;
    } catch (err) {
      console.error(err);
      setError('Failed to save resumes.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // REMOVE RESUME
  const removeResume = async (id) => {
    const resume = resumes.find(r => r.id === id);
    if (!resume || !resume.resume_id) {
      setResumes(prev => prev.filter(file => file.id !== id));
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/resumes/${resume.resume_id}`,
        {
          method: "DELETE",
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      const data = await response.json();

      if (data.success) {
        setResumes(prev => prev.filter(file => file.id !== id));
      } else {
        setError(data.error || 'Failed to delete resume');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to delete resume');
    }
  };

  // FETCH RESUMES
  const fetchResumes = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/resumes",
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      const data = await response.json();

      if (data.success) {
        // Convert backend data to frontend format
        const fetchedResumes = data.resumes.map(resume => ({
          id: crypto.randomUUID(),
          resume_id: resume.id,
          name: resume.filename,
          size: 'Unknown', // Backend doesn't store size
          type: 'application/pdf', // Assume PDF
          uploadedAt: new Date().toISOString(),
          status: 'Uploaded'
        }));

        setResumes(fetchedResumes);
      } else {
        setError('Failed to fetch resumes');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch resumes');
    } finally {
      setLoading(false);
    }
  };

  const saveJobDescription = async () => {
    if (resumes.length === 0) {
      setError('Please upload at least one resume.');
      return false;
    }

    if (!jobDescription.trim()) {
      setError('Please add a job description.');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const persisted = await uploadStagedResumes();
      if (!persisted) {
        return false;
      }

      const title = jobDescription
        .split('\n')[0]
        .trim()
        .slice(0, 80) || 'Untitled Job';

      const response = await fetch(
        'http://127.0.0.1:8000/create-job',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            title,
            description: jobDescription
          })
        }
      );

      const jobData = await response.json();
      if (!jobData.success) {
        setError(jobData.error || 'Failed to save job description');
        return false;
      }

      return true;
    } catch (err) {
      console.error(err);
      setError('Failed to save job description.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const processRankings = async () => {
    const saved = await saveJobDescription();
    if (!saved) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('READY FOR BACKEND API');

      /*
        LATER:

        1. Upload resumes
        2. Send job description
        3. Backend returns rankings
      */

      setRankings([]);
    } catch (err) {
      setError('Failed to process rankings.');
    } finally {
      setLoading(false);
    }
  };

  // RESET
  const resetData = () => {

    setResumes([]);

    setRankings([]);

    setJobDescription('');

    setError(null);
  };

  return (
    <ProjectContext.Provider
      value={{

        resumes,
        setResumes,

        addResumes,
        uploadStagedResumes,
        saveJobDescription,
        removeResume,
        fetchResumes,

        jobDescription,
        setJobDescription,

        rankings,
        setRankings,

        processRankings,

        loading,
        setLoading,

        error,
        setError,

        resetData

      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {

  const context = useContext(ProjectContext);

  if (!context) {
    throw new Error(
      'useProject must be used within ProjectProvider'
    );
  }

  return context;
};