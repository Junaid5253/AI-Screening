import React from 'react';
import { Search, Bell, UserCircle, HelpCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const pathName = location.pathname.substring(1).replace('-', ' ');
  const title = pathName.charAt(0).toUpperCase() + pathName.slice(1) || 'Dashboard';

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10">
      <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
      
      <div className="flex items-center gap-6">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search candidates..." 
            className="bg-slate-100 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 w-64 outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-4 text-slate-500">
          <button className="hover:text-indigo-600 transition-colors">
            <HelpCircle size={20} />
          </button>
          <button className="relative hover:text-indigo-600 transition-colors">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 bg-red-500 w-2 h-2 rounded-full border-2 border-white"></span>
          </button>
          <div className="h-8 w-px bg-slate-200 mx-1"></div>
          <button className="flex items-center gap-2 hover:text-indigo-600 transition-colors">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700">
              <UserCircle size={69} />
            </div>
            <span className="text-sm font-medium text-slate-700 hidden sm:block">Admin User</span>
          </button>
        </div>
      </div>
    </header>
  );
}
