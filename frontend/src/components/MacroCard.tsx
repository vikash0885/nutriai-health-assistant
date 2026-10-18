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
      bar: 'bg-violet-500',
      text: 'text-violet-300',
      bg: 'bg-violet-950/80',
      border: 'border-violet-800/60',
    },
    indigo: {
      bar: 'bg-indigo-500',
      text: 'text-indigo-300',
      bg: 'bg-indigo-950/80',
      border: 'border-indigo-800/60',
    },
    emerald: {
      bar: 'bg-emerald-500',
      text: 'text-emerald-300',
      bg: 'bg-emerald-950/80',
      border: 'border-emerald-800/60',
    },
    amber: {
      bar: 'bg-amber-500',
      text: 'text-amber-300',
      bg: 'bg-amber-950/80',
      border: 'border-amber-800/60',
    },
    blue: {
      bar: 'bg-sky-500',
      text: 'text-sky-300',
      bg: 'bg-sky-950/80',
      border: 'border-sky-800/60',
    },
    purple: {
      bar: 'bg-purple-500',
      text: 'text-purple-300',
      bg: 'bg-purple-950/80',
      border: 'border-purple-800/60',
    },
    rose: {
      bar: 'bg-rose-500',
      text: 'text-rose-300',
      bg: 'bg-rose-950/80',
      border: 'border-rose-800/60',
    },
  };

  const scheme = colorMap[color];
  const clamped = Math.min(Math.max(data.percentage, 0), 100);

  return (
    <div className="bg-[#131d38] rounded-2xl p-4 border border-slate-800 shadow-sm hover:border-slate-700 transition-all">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon && <div className={`p-1.5 rounded-lg border ${scheme.bg} ${scheme.text} ${scheme.border}`}>{icon}</div>}
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
        </div>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${scheme.bg} ${scheme.text} ${scheme.border}`}>
          {Math.round(data.percentage)}%
        </span>
      </div>

      <div className="flex items-baseline justify-between mt-1 mb-2">
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-bold text-white">{Math.round(data.current)}</span>
          <span className="text-xs text-slate-400">/ {Math.round(data.target)} {data.unit || 'g'}</span>
        </div>
        <span className="text-xs text-slate-400 font-medium">
          {Math.max(0, Math.round(data.target - data.current))} left
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${scheme.bar}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
