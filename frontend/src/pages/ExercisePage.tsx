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
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Exercise & Digestion Support</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Post-meal gentle mobility routines and daily fitness tracking powered by MET calorie calculation.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Recommended Routines Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Tailored Digestion & Fitness Routines</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((routine, idx) => (
            <div
              key={idx}
              onClick={() => handleSelectRoutine(routine)}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm hover:border-emerald-400 cursor-pointer transition-all space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-bold text-slate-900">{routine.title}</h4>
                  <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full capitalize">
                    {routine.intensity}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-2">{routine.benefits}</p>
                <div className="text-[11px] text-amber-900 bg-amber-50 p-2 rounded-xl border border-amber-200/50">
                  ⚠️ {routine.safety_notes}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-400 font-medium">
                <span>⏱️ {routine.duration_minutes} mins</span>
                <span className="text-emerald-700 font-bold">~{Math.round(routine.estimated_calories)} kcal</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Log Exercise Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Plus className="w-4 h-4 text-emerald-600" />
          <span>Log Completed Activity</span>
        </h3>

        <form onSubmit={handleSaveExercise} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Activity Name</label>
              <input
                type="text"
                required
                value={activityName}
                onChange={(e) => setActivityName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white"
              >
                <option value="post_meal_stroll">Post-Meal Stroll (Gentle walking)</option>
                <option value="walking">Brisk Walking</option>
                <option value="cardio">Cardio / Jogging / Cycling</option>
                <option value="strength">Strength Training</option>
                <option value="yoga">Yoga & Pranayama</option>
                <option value="stretching">Mobility & Stretching</option>
                <option value="other">Other Activity</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Duration (minutes)</label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  min="1"
                  max="360"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value) || 1)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Intensity</label>
              <div className="grid grid-cols-3 gap-2">
                {(['low', 'moderate', 'high'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setIntensity(lvl)}
                    className={`py-2 text-xs font-semibold rounded-xl capitalize transition-all ${
                      intensity === lvl
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Optional Notes</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. 15 mins stroll after lunch"
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5 disabled:opacity-60"
          >
            {isSaving ? 'Logging...' : 'Save Activity Entry'}
          </button>
        </form>
      </div>

      {/* Activity History */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Recorded Activity History</h3>

        {isLoading ? (
          <div className="py-8 text-center text-xs text-slate-400">Loading exercise logs...</div>
        ) : exercises.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No activities logged yet. Record your morning walk or post-meal stroll!
          </div>
        ) : (
          <div className="space-y-2.5">
            {exercises.map((ex) => (
              <div
                key={ex.id}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{ex.activity_name}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {new Date(ex.logged_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    {` • ${ex.duration_minutes} mins • ${ex.intensity} intensity`}
                    {ex.notes && ` • "${ex.notes}"`}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-700">{Math.round(ex.calories_burned)} kcal</span>
                    <span className="text-[10px] text-slate-400 block">burned</span>
                  </div>

                  <button
                    onClick={() => handleDelete(ex.id)}
                    className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
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
