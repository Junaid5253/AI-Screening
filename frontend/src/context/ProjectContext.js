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

    setLoading(true);

    setError(null);

    try {

      const uploadedFiles = [];

      for (const file of newFiles) {

        const formData = new FormData();

        formData.append("file", file);

        /*
          SEND TO FASTAPI
        */

        const response = await fetch(
          "http://127.0.0.1:8000/upload-resume",
          {
            method: "POST",
            body: formData
          }
        );

        const data = await response.json();


        if (data.error) {

          setError(data.error);

          continue;
        }
        /*
          SAVE FILE INFO
        */

        uploadedFiles.push({

          id: crypto.randomUUID(),

          file: file,

          name: file.name,

          size: file.size ? `${(file.size / 1024).toFixed(2)} KB` : '0 KB',

          type: file.type,

          uploadedAt: new Date().toISOString(),

          extractedText: data.extracted_text || '',

          savedPath: data.saved_path || '',

          status: 'Uploaded'
        });
      }

      setResumes(prev => [
        ...prev,
        ...uploadedFiles
      ]);

    } catch (err) {

      console.error(err);

      setError(
        'Failed to upload resumes.'
      );

    } finally {

      setLoading(false);
    }
  };

  // REMOVE RESUME
  const removeResume = (id) => {
    setResumes(prev =>
      prev.filter(file => file.id !== id)
    );
  };

  // PLACEHOLDER
  // later backend API will replace this
  const processRankings = async () => {

    if (resumes.length === 0) {
      setError('Please upload at least one resume.');
      return;
    }

    if (!jobDescription.trim()) {
      setError('Please add a job description.');
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
        removeResume,

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