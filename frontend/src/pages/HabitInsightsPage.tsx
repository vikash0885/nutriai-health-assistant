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
    <div className="w-full space-y-6 pb-12">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Your Habit Insights</h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Objective behavioral patterns mined from your nutrition, hydration, and activity trends.
        </p>
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-xs text-zinc-500">
          <div className="w-8 h-8 border-4 border-amber-500/20 border-t-amber-400 rounded-full animate-spin mx-auto mb-2" />
          <span>Evaluating lifestyle consistency...</span>
        </div>
      ) : habits.length === 0 ? (
        <div className="bg-gradient-to-br from-[#1a1205]/95 via-[#110a02]/95 to-[#070401] rounded-3xl p-12 text-center border border-amber-500/35 shadow-xl max-w-md mx-auto space-y-3">
          <TrendingUp className="w-12 h-12 text-amber-400 mx-auto opacity-80" />
          <h3 className="text-base font-bold text-white">More Records Needed</h3>
          <p className="text-xs text-zinc-400">
            Log your meals, water intake, and activities consistently for 3 or more days to reveal recurring habits!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {habits.map((h, i) => (
            <div key={i} className="bg-gradient-to-br from-[#1c1205]/95 via-[#120a02]/95 to-[#080401] rounded-3xl p-6 sm:p-8 border border-amber-500/35 hover:border-amber-500/60 shadow-xl space-y-3 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-amber-950/60 border border-amber-800/50 text-amber-400">
                    <TrendingUp className="w-4 h-4" />
                  </span>
                  <h3 className="text-lg font-black text-white">{h.title}</h3>
                </div>

                <span className="text-xs font-extrabold uppercase tracking-wider bg-amber-950/60 border border-amber-800/50 text-amber-300 px-3 py-1 rounded-full">
                  {h.confidence} Confidence
                </span>
              </div>

              <p className="text-sm sm:text-base text-zinc-200 leading-relaxed">{h.description}</p>

              {h.actionable_tip && (
                <div className="p-3.5 bg-amber-950/20 border border-amber-900/30 rounded-2xl text-sm text-amber-200 font-medium">
                  <strong>Practical Action to Consider:</strong> {h.actionable_tip}
                </div>
              )}

              <div className="text-xs text-zinc-400 pt-2.5 border-t border-zinc-800 flex items-center gap-2">
                <Info className="w-4 h-4 flex-shrink-0" />
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
