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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Symptom Diary</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Privately log digestive signals to uncover personal food associations over time.
          </p>
        </div>

        <Link
          to="/patterns"
          className="inline-flex items-center gap-2 bg-violet-50 hover:bg-violet-100 text-violet-700 font-semibold px-4 py-2 rounded-2xl border border-violet-200 text-xs transition-all self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>Analyze Food Patterns</span>
        </Link>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-green-50 border border-green-200 text-xs text-green-800 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Log Symptom Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Plus className="w-4 h-4 text-violet-600" />
          <span>Log a Bodily or Digestive Feeling</span>
        </h3>

        <form onSubmit={handleSaveSymptom} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Symptom Type</label>
              <select
                value={symptomType}
                onChange={(e) => setSymptomType(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-white"
              >
                {symptomOptions.map((symp) => (
                  <option key={symp} value={symp}>
                    {symp}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Severity</label>
              <div className="grid grid-cols-3 gap-2">
                {(['mild', 'moderate', 'severe'] as const).map((sev) => (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setSeverity(sev)}
                    className={`py-2 text-xs font-semibold rounded-xl capitalize transition-all ${
                      severity === sev
                        ? sev === 'severe'
                          ? 'bg-rose-600 text-white shadow-sm'
                          : sev === 'moderate'
                          ? 'bg-amber-600 text-white shadow-sm'
                          : 'bg-violet-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Onset Time After Last Meal (minutes)
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  min="0"
                  max="1440"
                  value={onsetMinutes}
                  onChange={(e) => setOnsetMinutes(Number(e.target.value) || 0)}
                  placeholder="e.g. 45"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Suspected Food Trigger (Optional)
              </label>
              <input
                type="text"
                value={suspectedFood}
                onChange={(e) => setSuspectedFood(e.target.value)}
                placeholder="e.g. Fried snacks, heavy cream, milk"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Contextual Notes</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Ate quickly during a busy meeting, high stress"
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold shadow-md shadow-violet-600/20 transition-all flex items-center justify-center gap-1.5 disabled:opacity-60"
          >
            {isSaving ? 'Saving...' : 'Save Symptom Entry'}
          </button>
        </form>
      </div>

      {/* Symptom History */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Recorded Symptom History</h3>

        {isLoading ? (
          <div className="py-8 text-center text-xs text-slate-400">Loading history...</div>
        ) : symptoms.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No symptoms logged yet. If you ever feel post-meal discomfort, record it above!
          </div>
        ) : (
          <div className="space-y-2.5">
            {symptoms.map((s) => {
              const sevBadge =
                s.severity === 'severe'
                  ? 'bg-rose-100 text-rose-800'
                  : s.severity === 'moderate'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-violet-100 text-violet-800';

              const logDate = new Date(s.logged_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={s.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">{s.symptom_type}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${sevBadge}`}>
                        {s.severity}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {logDate}
                      {s.onset_minutes_after_meal && ` • ~${s.onset_minutes_after_meal} mins after meal`}
                      {s.suspected_food && ` • Trigger: ${s.suspected_food}`}
                      {s.notes && ` • "${s.notes}"`}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDelete(s.id)}
                    className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
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
