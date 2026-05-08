import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileUp, 
  FileText, 
  ListOrdered, 
  Settings, 
  LogOut,
  BrainCircuit
} from 'lucide-react';
import { clsx } from 'clsx';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: FileUp, label: 'Resume Upload', path: '/upload' },
  { icon: FileText, label: 'Job Description', path: '/job-description' },
  { icon: ListOrdered, label: 'Ranking Results', path: '/results' },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <BrainCircuit className="text-white" size={24} />
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
          HireSense
        </span>
      </div>

      <nav className="flex-1 px-4 space-y-1 py-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => clsx(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium",
              isActive 
                ? "bg-indigo-50 text-indigo-700 shadow-sm" 
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100 space-y-1">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 transition-all font-medium">
          <Settings size={20} />
          Settings
        </button>
        <NavLink to="/login" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all font-medium">
          <LogOut size={20} />
          Logout
        </NavLink>
      </div>
    </aside>
  );
}
