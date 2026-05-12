import React, { useEffect } from 'react';
import { Users, FileCheck, ClipboardList, TrendingUp, Search, UserPlus } from 'lucide-react';
import Card from '../components/Common/Card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { useProject } from '../context/ProjectContext';
import { motion } from 'framer-motion';

const activityData = [
  { name: 'Mon', count: 12 },
  { name: 'Tue', count: 18 },
  { name: 'Wed', count: 15 },
  { name: 'Thu', count: 25 },
  { name: 'Fri', count: 32 },
  { name: 'Sat', count: 10 },
  { name: 'Sun', count: 5 },
];

export default function Dashboard() {
  const { resumes, rankings, fetchResumes } = useProject();

  useEffect(() => {
    fetchResumes();
  }, []);

  const chartData = [
    { range: '90-100%', count: rankings.filter(r => r.score >= 90).length },
    { range: '80-89%', count: rankings.filter(r => r.score >= 80 && r.score < 90).length },
    { range: '70-79%', count: rankings.filter(r => r.score >= 70 && r.score < 80).length },
    { range: 'Below 70%', count: rankings.filter(r => r.score < 70).length },
  ];

  // If no rankings, use dummy data for visualization preview
  const displayChartData = rankings.length > 0 
    ? chartData 
    : [
      { range: '90-100%', count: 4 },
      { range: '80-89%', count: 7 },
      { range: '70-79%', count: 5 },
      { range: 'Below 70%', count: 2 },
    ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800"> Overview</h1>
          <p className="text-slate-500">Welcome back, here's what's happening with your candidates.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
            <Search size={16} />
            Find Candidate
          </button>
          
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Total Resumes" value={resumes.length || "24"} icon={Users} trend="12" />
        <Card title="Ranked" value={rankings.length || "18"} icon={FileCheck} trend="8" />
        <Card title="Avg. Match" value={rankings.length > 0 ? `${Math.floor(rankings.reduce((acc, curr) => acc + curr.score, 0) / rankings.length)}%` : "74%"} icon={TrendingUp} trend="5" />
        <Card title="Active Specs" value="3" icon={ClipboardList} description="Job descriptions ready" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-800">Candidate Score Distribution</h3>
            <select className="bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold py-1 px-2 outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={displayChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold mb-8 text-slate-800">Upload Activity</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} dy={10} />
                <Tooltip 
                   contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-4 bg-indigo-50 rounded-xl">
             <p className="text-xs text-indigo-700 font-medium leading-relaxed">
               You've seen a <span className="font-bold">24% increase</span> in resume volume compared to last week.
             </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
