import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { DailyNutritionSummary, WeeklyNutritionSummary } from '../types';
import { MacroCard } from '../components/MacroCard';
import { MedicalDisclaimer } from '../components/MedicalDisclaimer';
import {
  PieChart as PieIcon,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Info,
  Fish,
  Wheat,
  Cookie,
  Droplet,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
} from 'recharts';

export const NutritionPage: React.FC = () => {
  const [daily, setDaily] = useState<DailyNutritionSummary | null>(null);
  const [weekly, setWeekly] = useState<WeeklyNutritionSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getDailySummary(), api.getWeeklySummary()])
      .then(([d, w]) => {
        setDaily(d);
        setWeekly(w);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading || !daily) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-500/20 border-t-amber-400 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Nutrition Analysis</h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Evidence-based analysis of your calories, macronutrients, and dietary patterns across your recorded meals.
        </p>
      </div>

      {/* Daily Progress Cards */}
      <div>
        <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wider mb-3">Today's Macronutrients</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MacroCard label="Protein" data={daily.protein} color="violet" icon={<Fish className="w-4 h-4" />} />
          <MacroCard label="Carbohydrates" data={daily.carbs} color="amber" icon={<Wheat className="w-4 h-4" />} />
          <MacroCard label="Healthy Fats" data={daily.fat} color="rose" icon={<Cookie className="w-4 h-4" />} />
          <MacroCard label="Dietary Fiber" data={daily.fiber} color="purple" icon={<Sparkles className="w-4 h-4" />} />
        </div>
      </div>

      {/* Micronutrients Strip */}
      <div className="bg-[#0d0d12] rounded-3xl p-6 border border-zinc-800/90 shadow-xl grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div>
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Daily Calories</span>
          <span className="text-xl font-black text-white">{Math.round(daily.total_calories)} kcal</span>
          <span className="text-[11px] text-zinc-500 block">Target: {daily.calorie_target} kcal</span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Total Sugars</span>
          <span className="text-xl font-bold text-white">{daily.total_sugar_g} g</span>
          <span className="text-[11px] text-zinc-500 block">Natural & added</span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Sodium</span>
          <span className="text-xl font-bold text-white">{daily.total_sodium_mg} mg</span>
          <span className="text-[11px] text-zinc-500 block">Guideline: &lt; 2000mg</span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Hydration</span>
          <span className="text-xl font-bold text-sky-400">{daily.total_water_ml} ml</span>
          <span className="text-[11px] text-zinc-500 block">Target: {daily.water_target_ml} ml</span>
        </div>
      </div>

      {/* Weekly Trends Chart */}
      {weekly && (
        <div className="bg-[#0d0d12] rounded-3xl p-6 sm:p-8 border border-zinc-800/90 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-white">7-Day Macronutrient Balance Trend</h3>
              <p className="text-xs text-zinc-400">Daily breakdown of Protein, Carbs, and Fat in grams</p>
            </div>
            <div className="text-xs text-amber-300 font-medium bg-amber-950/40 px-3 py-1.5 rounded-xl border border-amber-900/40">
              Avg: {Math.round(weekly.avg_calories)} kcal/day • {Math.round(weekly.avg_protein_g)}g Protein
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekly.days} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e1e28" />
                <XAxis dataKey="day_name" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#a1a1aa' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#a1a1aa' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#070709', borderRadius: '12px', border: '1px solid #f59e0b', color: '#fff', fontSize: '12px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="protein_g" fill="#f59e0b" name="Protein (g)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="carbs_g" fill="#eab308" name="Carbs (g)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="fat_g" fill="#f43f5e" name="Fat (g)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="fiber_g" fill="#10b981" name="Fiber (g)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Gaps, Potential Excesses & Practical Upgrades */}
      {weekly && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nutrition Gaps */}
          <div className="bg-[#0d0d12] rounded-3xl p-6 border border-zinc-800/90 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-amber-400">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <h3 className="text-sm font-bold text-white">Identified Nutrition Gaps</h3>
            </div>
            {weekly.nutrition_gaps.length === 0 ? (
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Your rolling weekly nutrition intake aligns well with your targets!</span>
              </div>
            ) : (
              <div className="space-y-2">
                {weekly.nutrition_gaps.map((gap, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-amber-950/20 border border-amber-900/40 text-xs text-amber-200 leading-relaxed">
                    • {gap}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Potential Excesses */}
          <div className="bg-[#0d0d12] rounded-3xl p-6 border border-zinc-800/90 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-rose-400">
              <Info className="w-5 h-5 flex-shrink-0" />
              <h3 className="text-sm font-bold text-white">Potential Excesses / Surpluses</h3>
            </div>
            {weekly.potential_excesses.length === 0 ? (
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>No significant caloric or macronutrient surpluses detected this week.</span>
              </div>
            ) : (
              <div className="space-y-2">
                {weekly.potential_excesses.map((exc, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-rose-950/20 border border-rose-900/40 text-xs text-rose-300 leading-relaxed">
                    • {exc}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <MedicalDisclaimer />
    </div>
  );
};
