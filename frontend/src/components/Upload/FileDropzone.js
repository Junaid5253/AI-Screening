import React, { useRef } from 'react';
import {
  Upload,
  X,
  FileText,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

import { useProject } from '../../context/ProjectContext';

import {
  motion,
  AnimatePresence
} from 'framer-motion';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_TYPES = [
  'application/pdf',

  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',

  'text/plain'
];


export default function FileDropzone() {

  const {
    resumes,
    addResumes,
    removeResume,
    error,
    setError
  } = useProject();

  const fileInputRef = useRef(null);

  // VALIDATION
  const validateFiles = (files) => {

    const validFiles = [];

    files.forEach(file => {

      // FILE TYPE
      if (!ALLOWED_TYPES.includes(file.type)) {

        setError(
          `${file.name} is not a supported file type.`
        );

        return;
      }

      // FILE SIZE
      if (file.size > MAX_FILE_SIZE) {

        setError(
          `${file.name} exceeds 10MB limit.`
        );

        return;
      }

      // DUPLICATES
      const duplicate = resumes.some(
        existing =>
          existing.name === file.name &&
          existing.size ===
          (file.size / 1024).toFixed(2) + ' KB'
      );

      if (duplicate) {

        setError(
          `${file.name} already uploaded.`
        );

        return;
      }

      validFiles.push(file);
    });

    return validFiles;
  };




  // FILE SELECT
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    setError(null);

    const validFiles = validateFiles(files);

    if (validFiles.length > 0) {
      await addResumes(validFiles);
    }
  };

  // DRAG
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // DROP
  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.dataTransfer.files || []);

    if (!files.length) return;

    setError(null);

    const validFiles = validateFiles(files);

    if (validFiles.length > 0) {
      await addResumes(validFiles);
    }

    e.dataTransfer.clearData();
  };

  return (
    <div className="space-y-6">

      {/* DROP ZONE */}
      <div
        onClick={() => fileInputRef.current.click()}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="
          border-2 border-dashed border-indigo-200
          rounded-2xl
          p-12
          flex flex-col items-center justify-center
          bg-indigo-50/20
          hover:bg-indigo-50/40
          hover:border-indigo-400
          transition-all
          cursor-pointer
          group
        "
      >

        <input
          type="file"
          ref={fileInputRef}
          multiple
          className="hidden"
          onChange={handleFileChange}
          accept=".pdf,.docx,.txt"
        />

        <div className="
          bg-indigo-100
          p-4
          rounded-full
          text-indigo-600
          group-hover:scale-110
          transition-transform
          mb-4
        ">
          <Upload size={32} />
        </div>

        <p className="text-xl font-semibold text-slate-700">
          Drop resumes here or click to browse
        </p>

        <p className="text-sm text-slate-400 mt-2">
          Supported: PDF, DOCX, TXT • Max 10MB
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div className="
          bg-rose-50
          border border-rose-100
          p-4
          rounded-xl
          flex gap-3
          items-center
        ">
          <AlertCircle
            size={18}
            className="text-rose-600 shrink-0"
          />

          <p className="text-sm text-rose-700 font-medium">
            {error}
          </p>
        </div>
      )}

      {/* FILE LIST */}
      <div className="space-y-3">

        <h4 className="
          text-sm
          font-semibold
          text-slate-700
          uppercase
          tracking-wider
          flex items-center gap-2
        ">
          Uploaded Files

          <span className="
            bg-slate-200
            text-slate-600
            px-2
            rounded-full
            text-[10px]
          ">
            {resumes.length}
          </span>
        </h4>

        <div className="grid gap-3">

          <AnimatePresence initial={false}>

            {resumes.map(file => (

              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="
                  flex items-center justify-between
                  p-4
                  bg-white
                  border border-slate-200
                  rounded-xl
                  shadow-sm
                "
              >

                <div className="flex items-center gap-4">

                  <div className="
                    bg-slate-100
                    p-2
                    rounded-lg
                  ">
                    <FileText
                      className="text-indigo-600"
                      size={24}
                    />
                  </div>

                  <div>

                    <p className="
                      text-sm
                      font-bold
                      text-slate-800
                    ">
                      {file.name}
                    </p>

                    <div className="
                      flex items-center gap-2 mt-1
                    ">

                      <span className="
                        text-xs text-slate-500
                      ">
                        {file.size}
                      </span>

                      <span className="
                        text-[10px]
                        text-slate-300
                      ">
                        •
                      </span>

                      <span className="
                        flex items-center gap-1
                        text-[10px]
                        font-bold
                        text-emerald-600
                        uppercase
                      ">
                        <CheckCircle2 size={10} />
                        Ready
                      </span>

                    </div>

                  </div>

                </div>

                <button
                  onClick={(e) => {

                    e.stopPropagation();

                    removeResume(file.id);

                  }}
                  className="
                    p-2
                    text-slate-400
                    hover:text-red-500
                    hover:bg-red-50
                    rounded-lg
                    transition-colors
                  "
                >
                  <X size={20} />
                </button>

              </motion.div>
            ))}

          </AnimatePresence>

          {resumes.length === 0 && (
            <div className="
              text-center
              py-10
              border border-slate-100
              rounded-xl
              bg-slate-50/50
            ">
              <p className="
                text-sm text-slate-400
              ">
                No resumes uploaded yet.
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}