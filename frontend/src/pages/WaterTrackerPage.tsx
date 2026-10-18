import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { WaterLog } from '../types';
import { ProgressRing } from '../components/ProgressRing';
import { MedicalDisclaimer } from '../components/MedicalDisclaimer';
import { Droplet, Plus, Trash2, CheckCircle2, Clock, Info } from 'lucide-react';

export const WaterTrackerPage: React.FC = () => {
  const [logs, setLogs] = useState<WaterLog[]>([]);
  const [summary, setSummary] = useState<{ total_ml: number; target_ml: number; percentage: number; glasses: number } | null>(null);
  const [customAmount, setCustomAmount] = useState<number>(250);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWater = async () => {
    try {
      const [history, sum] = await Promise.all([
        api.listWater(),
        api.getWaterSummary(),
      ]);
      setLogs(history);
      setSummary(sum);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWater();
  }, []);

  const handleAddWater = async (amount: number) => {
    try {
      await api.logWater(amount);
      fetchWater();
    } catch (err: any) {
      alert(`Could not log water: ${err.message}`);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.deleteWater(id);
      fetchWater();
    } catch (err: any) {
      alert(`Could not delete: ${err.message}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Water Tracker</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Stay mindfully hydrated to assist gut digestion, nutrient absorption, and cognitive focus.
        </p>
      </div>

      {/* Main Hydration Card */}
      {summary && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center justify-center text-center">
            <ProgressRing
              progress={summary.percentage}
              size={180}
              strokeWidth={16}
              colorClass="text-sky-500"
              bgColorClass="text-slate-100"
            >
              <Droplet className="w-8 h-8 text-sky-500 mb-1" />
              <span className="text-3xl font-black text-slate-900 leading-none">{summary.total_ml}</span>
              <span className="text-xs text-slate-400 font-semibold mt-1">/ {summary.target_ml} ml</span>
            </ProgressRing>
            <span className="text-xs font-bold text-sky-700 bg-sky-50 px-3 py-1 rounded-full mt-4">
              {Math.round(summary.percentage)}% of Daily Target
            </span>
          </div>

          {/* Quick Actions Panel */}
          <div className="flex-1 w-full space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Quick Log Buttons</h3>
              <p className="text-xs text-slate-400">Tap standard volumes to record instantly</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Small Glass', ml: 200 },
                { label: 'Standard Glass', ml: 250 },
                { label: 'Half Bottle', ml: 500 },
                { label: 'Large Flask', ml: 750 },
              ].map((p) => (
                <button
                  key={p.ml}
                  onClick={() => handleAddWater(p.ml)}
                  className="p-3 rounded-2xl bg-sky-50 hover:bg-sky-100 border border-sky-200/60 text-sky-900 flex flex-col items-center justify-center transition-all group"
                >
                  <Droplet className="w-5 h-5 text-sky-600 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold">+{p.ml} ml</span>
                  <span className="text-[10px] text-sky-600/80">{p.label}</span>
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <div className="pt-2 flex items-center gap-2">
              <input
                type="number"
                min="50"
                max="2000"
                step="50"
                value={customAmount}
                onChange={(e) => setCustomAmount(Number(e.target.value) || 250)}
                className="w-32 p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                placeholder="Custom ml"
              />
              <button
                onClick={() => handleAddWater(customAmount)}
                className="px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold shadow-md shadow-violet-600/20 transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Custom
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Today's Hydration Entries</h3>

        {isLoading ? (
          <div className="py-8 text-center text-xs text-slate-400">Loading water records...</div>
        ) : logs.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No water logged yet today. Drink a refreshing glass and tap +250ml!
          </div>
        ) : (
          <div className="space-y-2">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-sky-100 text-sky-700">
                    <Droplet className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{log.amount_ml} ml</h4>
                    <p className="text-[11px] text-slate-400">
                      {new Date(log.logged_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(log.id)}
                  className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 bg-sky-50/60 rounded-2xl border border-sky-100 text-xs text-slate-600 flex items-start gap-2">
        <Info className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
        <span>
          Hydration guidance note: Fluid requirements vary by environmental heat, physical exertion,
          and personal physiology. Users with clinically prescribed fluid restrictions (e.g. kidney or heart conditions)
          should follow their doctor's specific limits.
        </span>
      </div>
    </div>
  );
};
