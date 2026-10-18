import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { HabitInsight } from '../types';
import { MedicalDisclaimer } from '../components/MedicalDisclaimer';
import { TrendingUp, CheckCircle2, AlertCircle, Info, Sparkles } from 'lucide-react';

export const HabitInsightsPage: React.FC = () => {
  const [habits, setHabits] = useState<HabitInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.getDashboardSummary()
      .then((data) => {
        setHabits(data.habit_insights || []);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Your Habit Insights</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Objective behavioral patterns mined from your nutrition, hydration, and activity trends.
        </p>
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-xs text-slate-400">
          <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto mb-2" />
          <span>Evaluating lifestyle consistency...</span>
        </div>
      ) : habits.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm max-w-md mx-auto space-y-3">
          <TrendingUp className="w-12 h-12 text-violet-600 mx-auto opacity-60" />
          <h3 className="text-base font-bold text-slate-900">More Records Needed</h3>
          <p className="text-xs text-slate-500">
            Log your meals, water intake, and activities consistently for 3 or more days to reveal recurring habits!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {habits.map((h, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-3 hover:border-violet-200 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-violet-50 text-violet-700">
                    <TrendingUp className="w-4 h-4" />
                  </span>
                  <h3 className="text-base font-bold text-slate-900">{h.title}</h3>
                </div>

                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                  {h.confidence} Confidence
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{h.description}</p>

              {h.actionable_tip && (
                <div className="p-3.5 bg-violet-50/70 border border-violet-100 rounded-2xl text-xs text-violet-950 font-medium">
                  <strong>Practical Action to Consider:</strong> {h.actionable_tip}
                </div>
              )}

              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{h.medical_disclaimer}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <MedicalDisclaimer />
    </div>
  );
};
