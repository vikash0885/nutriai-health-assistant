import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { SymptomLog } from '../types';
import { MedicalDisclaimer } from '../components/MedicalDisclaimer';
import {
  ActivitySquare,
  Plus,
  Trash2,
  Clock,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

export const SymptomDiaryPage: React.FC = () => {
  const [symptoms, setSymptoms] = useState<SymptomLog[]>([]);
  const [symptomType, setSymptomType] = useState('Bloating');
  const [severity, setSeverity] = useState<'mild' | 'moderate' | 'severe'>('mild');
  const [onsetMinutes, setOnsetMinutes] = useState<number>(60);
  const [suspectedFood, setSuspectedFood] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const symptomOptions = [
    'Bloating',
    'Acidity / Heartburn',
    'Indigestion / Fullness',
    'Constipation',
    'Nausea',
    'Fatigue / Post-Meal Sluggishness',
    'Headache',
    'Cramping',
    'Gas / Flatulence',
    'Other Discomfort',
  ];

  const fetchSymptoms = async () => {
    try {
      const data = await api.listSymptoms();
      setSymptoms(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSymptoms();
  }, []);

  const handleSaveSymptom = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg(null);
    try {
      await api.createSymptom({
        symptom_type: symptomType,
        severity,
        onset_minutes_after_meal: Number(onsetMinutes) || null,
        suspected_food: suspectedFood.trim() || null,
        notes: notes.trim() || null,
      });

      setSuccessMsg(`Recorded ${symptomType} log.`);
      setSuspectedFood('');
      setNotes('');
      fetchSymptoms();
    } catch (err: any) {
      alert(`Could not log symptom: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this symptom record?')) return;
    try {
      await api.deleteSymptom(id);
      fetchSymptoms();
    } catch (err: any) {
      alert(`Could not delete: ${err.message}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Symptom Diary</h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Privately log digestive signals to uncover personal food associations over time.
          </p>
        </div>

        <Link
          to="/patterns"
          className="inline-flex items-center gap-2 bg-[#0d0d12] hover:bg-zinc-800 text-amber-300 font-semibold px-4 py-2 rounded-2xl border border-zinc-800 text-xs transition-all self-start sm:self-auto cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Analyze Food Patterns</span>
        </Link>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Log Symptom Form */}
      <div className="bg-[#0d0d12] rounded-3xl p-6 sm:p-8 border border-zinc-800/90 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Log a Bodily or Digestive Feeling</span>
        </h3>

        <form onSubmit={handleSaveSymptom} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Symptom Type</label>
              <select
                value={symptomType}
                onChange={(e) => setSymptomType(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-black/60 border border-zinc-800 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 text-white"
              >
                {symptomOptions.map((symp) => (
                  <option key={symp} value={symp} className="bg-zinc-900 text-white">
                    {symp}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Severity</label>
              <div className="grid grid-cols-3 gap-2">
                {(['mild', 'moderate', 'severe'] as const).map((sev) => (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setSeverity(sev)}
                    className={`py-2 text-xs font-semibold rounded-xl capitalize transition-all cursor-pointer ${
                      severity === sev
                        ? sev === 'severe'
                          ? 'bg-rose-600 text-white shadow-sm font-bold'
                          : sev === 'moderate'
                          ? 'bg-amber-600 text-black font-extrabold shadow-sm'
                          : 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-extrabold shadow-sm'
                        : 'bg-black/60 border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Onset Time After Last Meal (minutes)
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  min="0"
                  max="1440"
                  value={onsetMinutes}
                  onChange={(e) => setOnsetMinutes(Number(e.target.value) || 0)}
                  placeholder="e.g. 45"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-black/60 border border-zinc-800 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Suspected Food Trigger (Optional)
              </label>
              <input
                type="text"
                value={suspectedFood}
                onChange={(e) => setSuspectedFood(e.target.value)}
                placeholder="e.g. Fried snacks, heavy cream, milk"
                className="w-full p-2.5 rounded-xl bg-black/60 border border-zinc-800 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 text-white placeholder:text-zinc-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Contextual Notes</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Ate quickly during a busy meeting, high stress"
              className="w-full p-2.5 rounded-xl bg-black/60 border border-zinc-800 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 text-white placeholder:text-zinc-600"
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-3 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-black font-extrabold rounded-xl text-xs shadow-lg shadow-amber-500/20 gold-box-glow transition-all flex items-center justify-center gap-1.5 disabled:opacity-60 cursor-pointer"
          >
            {isSaving ? 'Saving...' : 'Save Symptom Entry'}
          </button>
        </form>
      </div>

      {/* Symptom History */}
      <div className="bg-[#0d0d12] rounded-3xl p-6 border border-zinc-800/90 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white">Recorded Symptom History</h3>

        {isLoading ? (
          <div className="py-8 text-center text-xs text-zinc-500">Loading history...</div>
        ) : symptoms.length === 0 ? (
          <div className="py-8 text-center text-xs text-zinc-500">
            No symptoms logged yet. If you ever feel post-meal discomfort, record it above!
          </div>
        ) : (
          <div className="space-y-2.5">
            {symptoms.map((s) => {
              const sevBadge =
                s.severity === 'severe'
                  ? 'bg-rose-950/70 border border-rose-800/50 text-rose-300'
                  : s.severity === 'moderate'
                  ? 'bg-amber-950/70 border border-amber-800/50 text-amber-300'
                  : 'bg-zinc-800 text-zinc-300 border border-zinc-700/60';

              const logDate = new Date(s.logged_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={s.id}
                  className="p-3.5 rounded-2xl bg-black/60 border border-zinc-800/80 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white">{s.symptom_type}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${sevBadge}`}>
                        {s.severity}
                      </span>
                    </div>

                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      {logDate}
                      {s.onset_minutes_after_meal && ` • ~${s.onset_minutes_after_meal} mins after meal`}
                      {s.suspected_food && ` • Trigger: ${s.suspected_food}`}
                      {s.notes && ` • "${s.notes}"`}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDelete(s.id)}
                    className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <MedicalDisclaimer />
    </div>
  );
};
