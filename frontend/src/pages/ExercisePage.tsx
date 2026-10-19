import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ExerciseLog, ExercisePlanItem } from '../types';
import { MedicalDisclaimer } from '../components/MedicalDisclaimer';
import {
  Dumbbell,
  Plus,
  Trash2,
  Clock,
  Flame,
  CheckCircle2,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';

export const ExercisePage: React.FC = () => {
  const [exercises, setExercises] = useState<ExerciseLog[]>([]);
  const [recommendations, setRecommendations] = useState<ExercisePlanItem[]>([]);
  const [activityName, setActivityName] = useState('Post-Meal Digestion Stroll (Shatapawali)');
  const [category, setCategory] = useState('post_meal_stroll');
  const [durationMinutes, setDurationMinutes] = useState<number>(15);
  const [intensity, setIntensity] = useState<'low' | 'moderate' | 'high'>('low');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchExerciseData = async () => {
    try {
      const [history, recs] = await Promise.all([
        api.listExercises(),
        api.getExerciseRecommendations(),
      ]);
      setExercises(history);
      setRecommendations(recs);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExerciseData();
  }, []);

  const handleSelectRoutine = (r: ExercisePlanItem) => {
    setActivityName(r.title);
    setCategory(r.category);
    setDurationMinutes(r.duration_minutes);
    setIntensity(r.intensity as any);
  };

  const handleSaveExercise = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg(null);
    try {
      await api.createExercise({
        activity_name: activityName,
        activity_category: category,
        duration_minutes: Number(durationMinutes) || 15,
        intensity,
        notes: notes.trim() || null,
      });

      setSuccessMsg(`Logged ${activityName}!`);
      setNotes('');
      fetchExerciseData();
    } catch (err: any) {
      alert(`Could not log exercise: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this exercise log?')) return;
    try {
      await api.deleteExercise(id);
      fetchExerciseData();
    } catch (err: any) {
      alert(`Could not delete: ${err.message}`);
    }
  };

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Exercise & Digestion Support</h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Post-meal gentle mobility routines and daily fitness tracking powered by MET calorie calculation.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Recommended Routines Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Tailored Digestion & Fitness Routines</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((routine, idx) => {
            const intLower = routine.intensity.toLowerCase();
            const theme =
              intLower === 'high'
                ? { bg: 'from-[#2d0a0a]/95 via-[#1a0404]/95 to-[#0c0101]', border: 'border-red-500/40 hover:border-red-400/80', badge: 'bg-red-950/70 border-red-800/60 text-red-300', safety: 'bg-red-950/30 border-red-900/40 text-red-200' }
                : intLower === 'moderate'
                ? { bg: 'from-[#052618]/95 via-[#03170e]/95 to-[#010b06]', border: 'border-emerald-500/40 hover:border-emerald-400/80', badge: 'bg-emerald-950/70 border-emerald-800/60 text-emerald-300', safety: 'bg-emerald-950/30 border-emerald-900/40 text-emerald-200' }
                : { bg: 'from-[#061c32]/95 via-[#031120]/95 to-[#01070e]', border: 'border-sky-500/40 hover:border-sky-400/80', badge: 'bg-sky-950/70 border-sky-800/60 text-sky-300', safety: 'bg-sky-950/30 border-sky-900/40 text-sky-200' };

            return (
              <div
                key={idx}
                onClick={() => handleSelectRoutine(routine)}
                className={`bg-gradient-to-br ${theme.bg} rounded-3xl p-5 border ${theme.border} shadow-2xl cursor-pointer transition-all space-y-2 flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-bold text-white">{routine.title}</h4>
                    <span className={`text-xs font-black border px-2.5 py-0.5 rounded-full capitalize ${theme.badge}`}>
                      {routine.intensity}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-2">{routine.benefits}</p>
                  <div className={`text-xs p-2.5 rounded-xl border ${theme.safety}`}>
                    ⚠️ {routine.safety_notes}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/10 text-sm text-zinc-300 font-medium">
                  <span>⏱️ {routine.duration_minutes} mins</span>
                  <span className="text-amber-400 font-bold">~{Math.round(routine.estimated_calories)} kcal</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Log Exercise Form */}
      <div className="bg-gradient-to-br from-[#211504]/90 via-[#150d02]/95 to-[#0b0601] rounded-3xl p-6 sm:p-8 border border-amber-500/40 shadow-2xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Log Completed Activity</span>
        </h3>

        <form onSubmit={handleSaveExercise} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Activity Name</label>
              <input
                type="text"
                required
                value={activityName}
                onChange={(e) => setActivityName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-black/60 border border-zinc-800 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-black/60 border border-zinc-800 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 text-white"
              >
                <option value="post_meal_stroll" className="bg-zinc-900 text-white">Post-Meal Stroll (Gentle walking)</option>
                <option value="walking" className="bg-zinc-900 text-white">Brisk Walking</option>
                <option value="cardio" className="bg-zinc-900 text-white">Cardio / Jogging / Cycling</option>
                <option value="strength" className="bg-zinc-900 text-white">Strength Training</option>
                <option value="yoga" className="bg-zinc-900 text-white">Yoga & Pranayama</option>
                <option value="stretching" className="bg-zinc-900 text-white">Mobility & Stretching</option>
                <option value="other" className="bg-zinc-900 text-white">Other Activity</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Duration (minutes)</label>
              <div className="relative">
                <Clock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  min="1"
                  max="360"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value) || 1)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-black/60 border border-zinc-800 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Intensity</label>
              <div className="grid grid-cols-3 gap-2">
                {(['low', 'moderate', 'high'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setIntensity(lvl)}
                    className={`py-2 text-xs font-semibold rounded-xl capitalize transition-all cursor-pointer ${
                      intensity === lvl
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-extrabold shadow-sm'
                        : 'bg-black/60 border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Optional Notes</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. 15 mins stroll after lunch"
              className="w-full p-2.5 rounded-xl bg-black/60 border border-zinc-800 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 text-white placeholder:text-zinc-600"
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-3 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-black font-extrabold rounded-xl text-xs shadow-lg shadow-amber-500/20 gold-box-glow transition-all flex items-center justify-center gap-1.5 disabled:opacity-60 cursor-pointer"
          >
            {isSaving ? 'Logging...' : 'Save Activity Entry'}
          </button>
        </form>
      </div>

      {/* Activity History - Deep Indigo Sapphire */}
      <div className="bg-gradient-to-br from-[#091536]/90 via-[#050e24]/95 to-[#020512] rounded-3xl p-6 border border-indigo-500/40 shadow-2xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Dumbbell className="w-4 h-4 text-indigo-400" />
          <span>Recorded Activity History</span>
        </h3>

        {isLoading ? (
          <div className="py-8 text-center text-xs text-zinc-500">Loading exercise logs...</div>
        ) : exercises.length === 0 ? (
          <div className="py-8 text-center text-xs text-zinc-500">
            No activities logged yet. Record your morning walk or post-meal stroll!
          </div>
        ) : (
          <div className="space-y-2.5">
            {exercises.map((ex) => (
              <div
                key={ex.id}
                className="p-3.5 rounded-2xl bg-[#08112b]/80 border border-indigo-900/50 hover:border-indigo-500/50 transition-colors flex items-center justify-between"
              >
                <div>
                  <h4 className="text-sm font-bold text-white">{ex.activity_name}</h4>
                  <p className="text-xs text-zinc-300 mt-1 font-medium">
                    {new Date(ex.logged_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    {` • ${ex.duration_minutes} mins • ${ex.intensity} intensity`}
                    {ex.notes && ` • "${ex.notes}"`}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-sm font-bold text-amber-400">{Math.round(ex.calories_burned)} kcal</span>
                    <span className="text-xs text-zinc-400 block font-medium">burned</span>
                  </div>

                  <button
                    onClick={() => handleDelete(ex.id)}
                    className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <MedicalDisclaimer />
    </div>
  );
};
