import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import clsx from 'clsx';

export default function Card({ title, value, icon: Icon, trend, trendType = 'up', description }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</p>
            <h3 className="text-3xl font-bold mt-1 text-slate-900">{value}</h3>
          </div>
          
          {trend && (
            <div className="flex items-center gap-2">
              <span className={clsx(
                "flex items-center text-xs font-bold px-2 py-1 rounded-full",
                trendType === 'up' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
              )}>
                {trendType === 'up' ? <TrendingUp size={12} className="mr-1" /> : <TrendingDown size={12} className="mr-1" />}
                {trend}%
              </span>
              <span className="text-xs text-slate-400">vs last month</span>
            </div>
          )}
          
          {description && <p className="text-xs text-slate-400">{description}</p>}
        </div>
        
        <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}
