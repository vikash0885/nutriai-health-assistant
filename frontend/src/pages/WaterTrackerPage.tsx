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
    <div className="w-full space-y-6 pb-12">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Water Tracker</h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Stay mindfully hydrated to assist gut digestion, nutrient absorption, and cognitive focus.
        </p>
      </div>

      {/* Main Hydration Card - Deep Ocean Sapphire */}
      {summary && (
        <div className="bg-gradient-to-br from-[#041d33]/90 via-[#021324]/95 to-[#010810] rounded-3xl p-6 sm:p-8 border border-sky-500/40 shadow-2xl hover:border-sky-400 hover:shadow-sky-500/10 transition-all flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-xs">
          <div className="flex flex-col items-center justify-center text-center">
            <ProgressRing
              progress={summary.percentage}
              size={180}
              strokeWidth={16}
              colorClass="text-sky-400"
              bgColorClass="text-sky-950/50"
            >
              <Droplet className="w-8 h-8 text-sky-400 mb-1" />
              <span className="text-3xl font-black text-white leading-none">{summary.total_ml}</span>
              <span className="text-sm text-sky-300 font-semibold mt-1">/ {summary.target_ml} ml</span>
            </ProgressRing>
            <span className="text-xs font-black text-sky-300 bg-sky-950/80 border border-sky-500/40 px-3.5 py-1 rounded-full mt-4">
              {Math.round(summary.percentage)}% of Daily Target
            </span>
          </div>

          {/* Quick Actions Panel */}
          <div className="flex-1 w-full space-y-4">
            <div>
              <h3 className="text-base font-black text-white mb-1">Quick Log Buttons</h3>
              <p className="text-sm text-sky-200/80 font-medium">Tap standard volumes to record instantly</p>
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
                  className="p-3.5 rounded-2xl bg-gradient-to-br from-[#072c47]/80 via-[#041a2c]/85 to-[#020e17]/90 hover:from-[#0c4066] border border-sky-500/40 hover:border-sky-300 text-sky-100 flex flex-col items-center justify-center transition-all group cursor-pointer shadow-lg"
                >
                  <Droplet className="w-6 h-6 text-sky-400 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-black">+{p.ml} ml</span>
                  <span className="text-xs text-sky-300 font-semibold">{p.label}</span>
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
                className="w-36 p-2.5 rounded-xl bg-black/60 border border-sky-500/30 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 text-white placeholder:text-zinc-500"
                placeholder="Custom ml"
              />
              <button
                onClick={() => handleAddWater(customAmount)}
                className="px-5 py-2.5 bg-gradient-to-r from-sky-500 via-cyan-400 to-sky-500 hover:from-sky-400 hover:to-cyan-300 text-black rounded-xl text-sm font-black shadow-lg shadow-sky-500/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4.5 h-4.5" /> Add Custom
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History - Deep Marine Navy */}
      <div className="bg-gradient-to-br from-[#061826]/90 via-[#030e17]/95 to-[#01060a] rounded-3xl p-6 border border-sky-600/30 shadow-xl space-y-4 backdrop-blur-xs">
        <h3 className="text-base font-black text-white">Today's Hydration Entries</h3>

        {isLoading ? (
          <div className="py-8 text-center text-sm font-medium text-zinc-400">Loading water records...</div>
        ) : logs.length === 0 ? (
          <div className="py-8 text-center text-sm font-medium text-zinc-400">
            No water logged yet today. Drink a refreshing glass and tap +250ml!
          </div>
        ) : (
          <div className="space-y-2.5">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-2xl bg-gradient-to-r from-[#031c2d]/80 to-[#020f18]/90 border border-sky-500/30 flex items-center justify-between hover:border-sky-400/60 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-sky-950/70 border border-sky-800/60 text-sky-400">
                    <Droplet className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{log.amount_ml} ml</h4>
                    <p className="text-xs text-zinc-300 font-medium">
                      {new Date(log.logged_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(log.id)}
                  className="p-2 text-zinc-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 bg-gradient-to-r from-[#031322] to-[#010810] rounded-2xl border border-sky-500/30 text-xs text-sky-200/80 flex items-start gap-2">
        <Info className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
        <span>
          Hydration guidance note: Fluid requirements vary by environmental heat, physical exertion,
          and personal physiology. Users with clinically prescribed fluid restrictions (e.g. kidney or heart conditions)
          should follow their doctor's specific limits.
        </span>
      </div>
    </div>
  );
};
