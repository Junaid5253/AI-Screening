import React from 'react';
import FileDropzone from '../components/Upload/FileDropzone';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Info } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { motion } from 'framer-motion';

export default function ResumeUpload() {
  const navigate = useNavigate();
  const { resumes } = useProject();

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Upload Resumes</h1>
          <p className="text-slate-500">Add the candidate resumes you'd like to analyze and rank.</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-slate-400">Step 1 of 3</p>
          <div className="flex gap-1 mt-2">
            <div className="h-1.5 w-8 bg-indigo-600 rounded-full"></div>
            <div className="h-1.5 w-8 bg-slate-200 rounded-full"></div>
            <div className="h-1.5 w-8 bg-slate-200 rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3 items-start">
        <Info className="text-blue-500 shrink-0 mt-0.5" size={20} />
        <div>
          <p className="text-sm font-semibold text-blue-800">Pro Tip</p>
          <p className="text-xs text-blue-700 mt-1">
            For best results, ensure resumes are in clear text format. We recommend PDF or DOCX files with standard formatting.
          </p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
        <FileDropzone />
        
        <div className="mt-10 pt-8 border-t border-slate-100 flex justify-end">
          <button 
            disabled={resumes.length === 0}
            onClick={() => navigate('/job-description')}
            className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-100"
          >
            Continue to Job Description
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
