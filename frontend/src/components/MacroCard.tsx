import React from 'react';
import { MacroProgress } from '../types';

interface MacroCardProps {
  label: string;
  data: MacroProgress;
  color: 'violet' | 'indigo' | 'emerald' | 'amber' | 'blue' | 'purple' | 'rose';
  icon?: React.ReactNode;
}

export const MacroCard: React.FC<MacroCardProps> = ({ label, data, color, icon }) => {
  const colorMap = {
    violet: {
      bar: 'bg-violet-600',
      text: 'text-violet-700',
      bg: 'bg-violet-50',
      border: 'border-violet-200',
    },
    indigo: {
      bar: 'bg-indigo-600',
      text: 'text-indigo-700',
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
    },
    emerald: {
      bar: 'bg-emerald-600',
      text: 'text-emerald-700',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
    },
    amber: {
      bar: 'bg-amber-500',
      text: 'text-amber-700',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
    },
    blue: {
      bar: 'bg-sky-500',
      text: 'text-sky-700',
      bg: 'bg-sky-50',
      border: 'border-sky-200',
    },
    purple: {
      bar: 'bg-purple-600',
      text: 'text-purple-700',
      bg: 'bg-purple-50',
      border: 'border-purple-200',
    },
    rose: {
      bar: 'bg-rose-500',
      text: 'text-rose-700',
      bg: 'bg-rose-50',
      border: 'border-rose-200',
    },
  };

  const scheme = colorMap[color];
  const clamped = Math.min(Math.max(data.percentage, 0), 100);

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon && <div className={`p-1.5 rounded-lg ${scheme.bg} ${scheme.text}`}>{icon}</div>}
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
        </div>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${scheme.bg} ${scheme.text}`}>
          {Math.round(data.percentage)}%
        </span>
      </div>

      <div className="flex items-baseline justify-between mt-1 mb-2">
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-bold text-slate-900">{Math.round(data.current)}</span>
          <span className="text-xs text-slate-400">/ {Math.round(data.target)} {data.unit || 'g'}</span>
        </div>
        <span className="text-xs text-slate-400 font-medium">
          {Math.max(0, Math.round(data.target - data.current))} left
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${scheme.bar}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
