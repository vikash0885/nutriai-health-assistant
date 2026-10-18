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
        <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Nutrition Analysis</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Evidence-based analysis of your calories, macronutrients, and dietary patterns across your recorded meals.
        </p>
      </div>

      {/* Daily Progress Cards */}
      <div>
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">Today's Macronutrients</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MacroCard label="Protein" data={daily.protein} color="violet" icon={<Fish className="w-4 h-4" />} />
          <MacroCard label="Carbohydrates" data={daily.carbs} color="amber" icon={<Wheat className="w-4 h-4" />} />
          <MacroCard label="Healthy Fats" data={daily.fat} color="rose" icon={<Cookie className="w-4 h-4" />} />
          <MacroCard label="Dietary Fiber" data={daily.fiber} color="purple" icon={<Sparkles className="w-4 h-4" />} />
        </div>
      </div>

      {/* Micronutrients Strip */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Daily Calories</span>
          <span className="text-xl font-black text-slate-900">{Math.round(daily.total_calories)} kcal</span>
          <span className="text-[11px] text-slate-400 block">Target: {daily.calorie_target} kcal</span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Sugars</span>
          <span className="text-xl font-bold text-slate-800">{daily.total_sugar_g} g</span>
          <span className="text-[11px] text-slate-400 block">Natural & added</span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Sodium</span>
          <span className="text-xl font-bold text-slate-800">{daily.total_sodium_mg} mg</span>
          <span className="text-[11px] text-slate-400 block">Guideline: &lt; 2000mg</span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Hydration</span>
          <span className="text-xl font-bold text-violet-700">{daily.total_water_ml} ml</span>
          <span className="text-[11px] text-slate-400 block">Target: {daily.water_target_ml} ml</span>
        </div>
      </div>

      {/* Weekly Trends Chart */}
      {weekly && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900">7-Day Macronutrient Balance Trend</h3>
              <p className="text-xs text-slate-400">Daily breakdown of Protein, Carbs, and Fat in grams</p>
            </div>
            <div className="text-xs text-slate-500 font-medium bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
              Avg: {Math.round(weekly.avg_calories)} kcal/day • {Math.round(weekly.avg_protein_g)}g Protein
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekly.days} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day_name" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#172554', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="protein_g" fill="#7C3AED" name="Protein (g)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="carbs_g" fill="#f59e0b" name="Carbs (g)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="fat_g" fill="#f43f5e" name="Fat (g)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="fiber_g" fill="#a855f7" name="Fiber (g)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Gaps, Potential Excesses & Practical Upgrades */}
      {weekly && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nutrition Gaps */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-amber-700">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <h3 className="text-sm font-bold text-slate-900">Identified Nutrition Gaps</h3>
            </div>
            {weekly.nutrition_gaps.length === 0 ? (
              <div className="p-4 rounded-2xl bg-green-50 border border-green-200 text-xs text-green-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>Your rolling weekly nutrition intake aligns well with your targets!</span>
              </div>
            ) : (
              <div className="space-y-2">
                {weekly.nutrition_gaps.map((gap, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/50 text-xs text-amber-900 leading-relaxed">
                    • {gap}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Potential Excesses */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-rose-700">
              <Info className="w-5 h-5 flex-shrink-0" />
              <h3 className="text-sm font-bold text-slate-900">Potential Excesses / Surpluses</h3>
            </div>
            {weekly.potential_excesses.length === 0 ? (
              <div className="p-4 rounded-2xl bg-green-50 border border-green-200 text-xs text-green-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>No significant caloric or macronutrient surpluses detected this week.</span>
              </div>
            ) : (
              <div className="space-y-2">
                {weekly.potential_excesses.map((exc, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-rose-50/70 border border-rose-200/50 text-xs text-rose-900 leading-relaxed">
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
