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
      cardBg: 'bg-gradient-to-br from-[#1e0e38]/85 via-[#130924]/90 to-[#0a0712]/95',
      cardBorder: 'border-violet-500/40 hover:border-violet-400 hover:shadow-violet-500/10',
      bar: 'bg-violet-500',
      text: 'text-violet-300',
      bg: 'bg-violet-950/80',
      border: 'border-violet-800/60',
    },
    indigo: {
      cardBg: 'bg-gradient-to-br from-[#081836]/85 via-[#061026]/90 to-[#060a17]/95',
      cardBorder: 'border-indigo-500/40 hover:border-indigo-400 hover:shadow-indigo-500/10',
      bar: 'bg-indigo-500',
      text: 'text-indigo-300',
      bg: 'bg-indigo-950/80',
      border: 'border-indigo-800/60',
    },
    emerald: {
      cardBg: 'bg-gradient-to-br from-[#072a17]/85 via-[#051a0f]/90 to-[#040e08]/95',
      cardBorder: 'border-emerald-500/40 hover:border-emerald-400 hover:shadow-emerald-500/10',
      bar: 'bg-emerald-500',
      text: 'text-emerald-300',
      bg: 'bg-emerald-950/80',
      border: 'border-emerald-800/60',
    },
    amber: {
      cardBg: 'bg-gradient-to-br from-[#281805]/85 via-[#1a1106]/90 to-[#0c0a07]/95',
      cardBorder: 'border-amber-500/40 hover:border-amber-400 hover:shadow-amber-500/10',
      bar: 'bg-amber-500',
      text: 'text-amber-300',
      bg: 'bg-amber-950/80',
      border: 'border-amber-800/60',
    },
    blue: {
      cardBg: 'bg-gradient-to-br from-[#062038]/85 via-[#041424]/90 to-[#040c15]/95',
      cardBorder: 'border-sky-500/40 hover:border-sky-400 hover:shadow-sky-500/10',
      bar: 'bg-sky-500',
      text: 'text-sky-300',
      bg: 'bg-sky-950/80',
      border: 'border-sky-800/60',
    },
    purple: {
      cardBg: 'bg-gradient-to-br from-[#200a2e]/85 via-[#14061e]/90 to-[#0a040f]/95',
      cardBorder: 'border-purple-500/40 hover:border-purple-400 hover:shadow-purple-500/10',
      bar: 'bg-purple-500',
      text: 'text-purple-300',
      bg: 'bg-purple-950/80',
      border: 'border-purple-800/60',
    },
    rose: {
      cardBg: 'bg-gradient-to-br from-[#2e0814]/85 via-[#1d060e]/90 to-[#0e070a]/95',
      cardBorder: 'border-rose-500/40 hover:border-rose-400 hover:shadow-rose-500/10',
      bar: 'bg-rose-500',
      text: 'text-rose-300',
      bg: 'bg-rose-950/80',
      border: 'border-rose-800/60',
    },
  };

  const scheme = colorMap[color];
  const clamped = Math.min(Math.max(data.percentage, 0), 100);

  return (
    <div className={`${scheme.cardBg} rounded-2xl p-4 border ${scheme.cardBorder} shadow-lg hover:shadow-xl transition-all`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon && <div className={`p-1.5 rounded-lg border ${scheme.bg} ${scheme.text} ${scheme.border}`}>{icon}</div>}
          <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">{label}</span>
        </div>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${scheme.bg} ${scheme.text} ${scheme.border}`}>
          {Math.round(data.percentage)}%
        </span>
      </div>

      <div className="flex items-baseline justify-between mt-1 mb-2">
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-bold text-white">{Math.round(data.current)}</span>
          <span className="text-xs text-zinc-300">/ {Math.round(data.target)} {data.unit || 'g'}</span>
        </div>
        <span className="text-xs text-zinc-400 font-medium">
          {Math.max(0, Math.round(data.target - data.current))} left
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-black/50 rounded-full h-2 overflow-hidden border border-white/5">
        <div
          className={`h-full rounded-full transition-all duration-500 ${scheme.bar}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
