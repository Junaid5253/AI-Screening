import React, { useEffect, useState } from 'react';
import { 
  Play, 
  RotateCcw, 
  Download, 
  Star, 
  ExternalLink, 
  AlertCircle,
  Loader2,
  CheckCircle2,
  Sparkles,
  BrainCircuit
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Ranking() {
  const { resumes, jobDescription, currentJobId, rankings, processRankings, loading, error, resetData } = useProject();
  const navigate = useNavigate();
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (resumes.length === 0) {
      navigate('/upload');
      return;
    }

    
  }, [resumes.length, rankings.length, hasStarted, currentJobId, jobDescription, navigate, processRankings]);

  const handleStartAnalysis = async () => {
    setHasStarted(true);
    await processRankings();
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to clear all data and start over?")) {
      resetData();
      navigate('/upload');
    }
  };

  const handleExportCSV = () => {
    if (rankings.length === 0) {
      return;
    }

    // Create CSV header
    const headers = ['Rank', 'Candidate Name', 'Match Score', 'Similarity Score', 'Skill Score', 'Experience Score', 'Experience', 'Status'];
    
    // Create CSV rows
    const rows = rankings.map(candidate => [
      candidate.rank,
      candidate.name,
      `${candidate.score}%`,
      `${candidate.similarity_score}%`,
      `${candidate.skill_score}%`,
      `${candidate.experience_score}%`,
      candidate.experience,
      candidate.status
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `rankings-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Ranking & Analysis</h1>
          <p className="text-slate-500">AI-powered candidate scoring based on your requirements.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleReset}
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            <RotateCcw size={16} />
            Reset
          </button>
          {!rankings.length && (
            <button 
              onClick={handleStartAnalysis}
              disabled={loading}
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-75"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : <Play size={16} />}
              {loading ? 'Analyzing...' : 'Run Analysis'}
            </button>
          )}
          {rankings.length > 0 && (
            <button 
              onClick={handleExportCSV}
              className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
            >
              <Download size={16} />
              Export CSV
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex gap-3 text-rose-800 items-center">
          <AlertCircle size={20} className="shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {loading && (
        <div className="bg-white rounded-2xl border border-slate-100 p-20 flex flex-col items-center justify-center space-y-6">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="text-indigo-600 animate-pulse" size={32} />
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold text-slate-800">Analyzing Resumes</h3>
            <p className="text-slate-500 mt-2 max-w-xs">Extracting skills and matching them against your job description...</p>
          </div>
        </div>
      )}

      {!loading && rankings.length === 0 && !hasStarted && (
        <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center">
          <div className="max-w-md mx-auto space-y-6">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={40} className="text-indigo-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">Ready for Analysis</h3>
              <p className="text-slate-500 mt-2">
                We have <span className="font-bold text-slate-700">{resumes.length} resumes</span> and 
                a <span className="font-bold text-slate-700">job description</span> loaded. Ready to run the AI engine?
              </p>
            </div>
            <button 
              onClick={handleStartAnalysis}
              className="bg-indigo-600 text-white px-10 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
            >
              Start AI Processing
            </button>
          </div>
        </div>
      )}

      {!loading && rankings.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50 text-left border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Candidate Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Match Score</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Experience</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Top Skills</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <AnimatePresence>
                  {rankings.map((candidate, idx) => (
                    <motion.tr 
                      key={candidate.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className={`flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm ${
                          candidate.rank === 1 ? 'bg-amber-100 text-amber-700' : 
                          candidate.rank === 2 ? 'bg-slate-100 text-slate-600' :
                          candidate.rank === 3 ? 'bg-orange-100 text-orange-700' :
                          'bg-transparent text-slate-400'
                        }`}>
                          #{candidate.rank}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800">{candidate.name}</div>
                        <div className="text-xs text-slate-400">ID: {candidate.id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${candidate.score}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className={`h-full ${candidate.score > 80 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                            ></motion.div>
                          </div>
                          <span className="font-bold text-slate-700">{candidate.score}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{candidate.experience}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {candidate.skills.map(skill => (
                            <span key={skill} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${
                          candidate.status === 'Highly Recommended' ? 'bg-emerald-50 text-emerald-700' :
                          candidate.status === 'Shortlisted' ? 'bg-indigo-50 text-indigo-700' :
                          'bg-slate-50 text-slate-500'
                        }`}>
                          {candidate.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                          <ExternalLink size={18} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>
      )}


    </div>
  );
}
