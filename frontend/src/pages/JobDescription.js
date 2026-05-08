import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Target, Sparkles } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { motion } from 'framer-motion';

export default function JobDescription() {
  const navigate = useNavigate();
  const { jobDescription, setJobDescription } = useProject();

  const handleApplySample = () => {
    setJobDescription(`We are looking for a Senior Frontend Engineer to join our dynamic team. 
The ideal candidate should have:
- 5+ years of experience with React and modern JavaScript.
- Proficiency in Tailwind CSS and state management (Redux/Context API).
- Experience with Node.js and RESTful APIs.
- Strong understanding of UI/UX principles and responsive design.
- Experience with Docker and AWS is a plus.`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Job Description</h1>
          <p className="text-slate-500">Provide the requirements to compare candidates against.</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-slate-400">Step 2 of 3</p>
          <div className="flex gap-1 mt-2">
            <div className="h-1.5 w-8 bg-indigo-600 rounded-full"></div>
            <div className="h-1.5 w-8 bg-indigo-600 rounded-full"></div>
            <div className="h-1.5 w-8 bg-slate-200 rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-700 font-bold">
            <div className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg">
              <Target size={18} />
            </div>
            Role Requirements
          </div>
          <button 
            onClick={handleApplySample}
            className="text-indigo-600 text-xs font-bold flex items-center gap-1 hover:underline"
          >
            <Sparkles size={14} />
            Use Sample Template
          </button>
        </div>

        <div className="relative">
          <textarea
            className="w-full h-80 bg-slate-50 border border-slate-200 rounded-xl p-6 text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all resize-none font-sans leading-relaxed"
            placeholder="Paste your job description, key responsibilities, and required skills here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
          <div className="absolute bottom-4 right-4 text-xs text-slate-400">
            {jobDescription.length} characters
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-slate-50">
          <button 
            onClick={() => navigate('/upload')}
            className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-700 px-4 py-2"
          >
            <ArrowLeft size={18} />
            Back to Upload
          </button>
          
          <button 
            disabled={!jobDescription.trim()}
            onClick={() => navigate('/results')}
            className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-100"
          >
            Preview Analysis
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
