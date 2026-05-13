import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react';

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {

  const [resumes, setResumes] = useState([]);

  const [jobDescription, internalSetJobDescription] = useState('');

  const [currentJobId, setCurrentJobId] = useState(() => {
    const stored = localStorage.getItem('currentJobId');
    return stored ? Number(stored) : null;
  });

  const [rankings, setRankings] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  // Fetch user's job description on mount
  useEffect(() => {
    const fetchUserJob = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch(
          'http://127.0.0.1:8000/current-job',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await response.json();

        if (data.success && data.job) {
          internalSetJobDescription(data.job.description);
          setCurrentJobId(data.job.id);
          localStorage.setItem('currentJobId', String(data.job.id));
        }
      } catch (err) {
        console.error('Failed to fetch job description:', err);
      }
    };

    fetchUserJob();
  }, []);

  const setJobDescription = (value) => {
    internalSetJobDescription(value);
  };

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
      // filesize converted function
      const formatSize = (bytes) => {
      if (!bytes && bytes !== 0) return "UNKNOWN";

      const kb = bytes / 1024;
      if (kb < 1024) return kb.toFixed(2) + " KB";

      const mb = kb / 1024;
      return mb.toFixed(2) + " MB";
      };

      const getFileType = (filename) => {
      const ext = filename.split('.').pop().toLowerCase();

      if (ext === 'pdf') return 'application/pdf';
      if (ext === 'doc' || ext === 'docx') return 'application/msword';
      if (ext === 'txt') return 'text/plain';

      return 'unknown';
      };

      if (data.success) {
        // Convert backend data to frontend format
        const fetchedResumes = data.resumes.map(resume => ({
          id: crypto.randomUUID(),
          resume_id: resume.id,
          name: resume.filename,
          size: formatSize(resume.file_size)  , 
          type: getFileType(resume.filename),
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
        return null;
      }

      setCurrentJobId(jobData.job_id);
      localStorage.setItem('currentJobId', String(jobData.job_id));

      return jobData;
    } catch (err) {
      console.error(err);
      setError('Failed to save job description.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchRankings = async (jobId) => {
    if (!jobId) {
      setError('No job selected for ranking.');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/rank/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'Failed to fetch rankings.');
        setRankings([]);
        return false;
      }

      const mappedRankings = data.rankings.map((item, idx) => ({
        id: item.resume_id,
        name: item.candidate_name,
        score: item.final_score,
        similarity_score: item.similarity_score,
        skill_score: item.skill_score,
        experience_score: item.experience_score,
        experience: item.experience_years != null ? `${item.experience_years} yrs` : `${item.experience_score}%`,
        skills: item.skills || [],
        rank: idx + 1,
        status: item.final_score >= 90 ? 'Highly Recommended' : item.final_score >= 70 ? 'Shortlisted' : 'Review'
      }));

      setRankings(mappedRankings);
      return true;
    } catch (err) {
      console.error(err);
      setError('Failed to fetch rankings.');
      setRankings([]);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const processRankings = async () => {
    if (!currentJobId) {
      const jobData = await saveJobDescription();
      if (!jobData) {
        return;
      }

      await fetchRankings(jobData.job_id);
      return;
    }

    await fetchRankings(currentJobId);
  };

  // RESET
  const resetData = () => {
    setResumes([]);
    setRankings([]);
    internalSetJobDescription('');
    setCurrentJobId(null);
    setError(null);
    localStorage.removeItem('currentJobId');
  };

  const logout = () => {
    localStorage.removeItem('token');
    resetData();
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
        currentJobId,
        processRankings,
        fetchRankings,
        loading,
        setLoading,
        error,
        setError,
        resetData,
        logout
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