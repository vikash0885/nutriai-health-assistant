import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { FoodPatternInsight } from '../types';
import { MedicalDisclaimer } from '../components/MedicalDisclaimer';
import {
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  AlertTriangle,
  Info,
  Calendar,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const PatternInsightsPage: React.FC = () => {
  const [insights, setInsights] = useState<FoodPatternInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPatterns = async () => {
    setIsLoading(true);
    try {
      const data = await api.getPatterns();
      setInsights(data);
    } catch (err) {
      console.error('Error fetching patterns', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatterns();
  }, []);

  const handleFeedback = async (insightId: number, feedback: 'helpful' | 'inaccurate' | 'not_relevant') => {
    try {
      const updated = await api.submitFeedback(insightId, feedback);
      setInsights((prev) => prev.map((item) => (item.id === insightId ? updated : item)));
    } catch (err: any) {
      alert(`Could not record feedback: ${err.message}`);
    }
  };

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Food & Symptom Insights
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Deterministic correlation analysis matching your recorded meals with post-meal symptoms.
          </p>
        </div>

        <button
          onClick={fetchPatterns}
          disabled={isLoading}
          className="inline-flex items-center gap-2 bg-[#0d0d12] hover:bg-zinc-800 text-amber-300 font-semibold px-4 py-2 rounded-2xl border border-zinc-800 text-xs transition-all self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Re-analyze My Diary</span>
        </button>
      </div>

      {/* Main Insights Content */}
      {isLoading ? (
        <div className="py-16 text-center text-xs text-zinc-500">
          <div className="w-8 h-8 border-4 border-amber-500/20 border-t-amber-400 rounded-full animate-spin mx-auto mb-2" />
          <span>Mining temporal associations across your meal and symptom logs...</span>
        </div>
      ) : insights.length === 0 ? (
        <div className="bg-[#0d0d12] rounded-3xl p-12 text-center border border-zinc-800/90 shadow-xl max-w-lg mx-auto space-y-3">
          <Sparkles className="w-12 h-12 text-amber-400 mx-auto opacity-80" />
          <h3 className="text-base font-bold text-white">No Repeated Patterns Found Yet</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            SehatSense AI strictly avoids fabricating false associations. We require at least 2 distinct instances
            where a symptom was logged within 6 hours of consuming a specific food before flagging a pattern.
          </p>
          <p className="text-[11px] text-zinc-500">
            Keep logging your daily meals in the Food Diary and any feelings in the Symptom Diary!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {insights.map((ins) => {
            const confColor =
              ins.confidence === 'high'
                ? 'bg-amber-950/70 text-amber-300 border border-amber-800/50'
                : ins.confidence === 'moderate'
                ? 'bg-yellow-950/70 text-yellow-300 border border-yellow-800/50'
                : 'bg-zinc-800 text-zinc-300';

            return (
              <div
                key={ins.id}
                className="bg-[#0d0d12] rounded-3xl p-6 sm:p-8 border border-zinc-800/90 shadow-xl space-y-4 hover:border-amber-500/40 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-amber-950/60 border border-amber-800/50 text-amber-400">
                      <Sparkles className="w-4 h-4" />
                    </span>
                    <h3 className="text-base font-bold text-white">{ins.title}</h3>
                  </div>

                  <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${confColor}`}>
                    {ins.confidence} confidence
                  </span>
                </div>

                <p className="text-sm text-zinc-300 leading-relaxed">{ins.description}</p>

                {ins.actionable_tip && (
                  <div className="bg-amber-950/20 p-3.5 rounded-2xl border border-amber-900/30 text-xs text-amber-200">
                    <strong className="block mb-0.5">Practical Tracking Step:</strong>
                    {ins.actionable_tip}
                  </div>
                )}

                {/* Medical Safety Disclaimer for this Pattern */}
                <div className="p-3 bg-black/60 rounded-xl border border-zinc-800 text-[11px] text-zinc-400 flex items-start gap-2">
                  <Info className="w-4 h-4 text-zinc-500 flex-shrink-0 mt-0.5" />
                  <span>{ins.medical_disclaimer}</span>
                </div>

                {/* Feedback Bar */}
                <div className="flex items-center justify-between pt-3 border-t border-zinc-800 text-xs text-zinc-400">
                  <span className="text-[11px]">Was this pattern observation accurate for you?</span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleFeedback(ins.id, 'helpful')}
                      className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-medium transition-all cursor-pointer ${
                        ins.user_feedback === 'helpful'
                          ? 'border-amber-400 bg-amber-950/50 text-amber-300 font-bold'
                          : 'border-zinc-800 hover:bg-zinc-800/60 text-zinc-300'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" /> Helpful
                    </button>

                    <button
                      onClick={() => handleFeedback(ins.id, 'inaccurate')}
                      className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-medium transition-all cursor-pointer ${
                        ins.user_feedback === 'inaccurate'
                          ? 'border-rose-700 bg-rose-950/50 text-rose-300 font-bold'
                          : 'border-zinc-800 hover:bg-zinc-800/60 text-zinc-300'
                      }`}
                    >
                      <ThumbsDown className="w-3.5 h-3.5" /> Inaccurate
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <MedicalDisclaimer />
    </div>
  );
};
