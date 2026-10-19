import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { FoodEntry, DailyNutritionSummary } from '../types';
import { MedicalDisclaimer } from '../components/MedicalDisclaimer';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  Trash2,
  UtensilsCrossed,
  Flame,
  Fish,
  Wheat,
  Cookie,
  Sparkles,
} from 'lucide-react';

export const FoodDiaryPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [summary, setSummary] = useState<DailyNutritionSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDayData = async (dateStr: string) => {
    setIsLoading(true);
    try {
      const [fEntries, dSummary] = await Promise.all([
        api.listFoodEntries(dateStr),
        api.getDailySummary(dateStr),
      ]);
      setEntries(fEntries);
      setSummary(dSummary);
    } catch (err) {
      console.error('Error fetching diary data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDayData(currentDate);
  }, [currentDate]);

  const handlePrevDay = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 1);
    setCurrentDate(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 1);
    setCurrentDate(d.toISOString().split('T')[0]);
  };

  const handleToday = () => {
    setCurrentDate(new Date().toISOString().split('T')[0]);
  };

  const handleDeleteEntry = async (id: number) => {
    if (!window.confirm('Are you sure you want to remove this food entry?')) return;
    try {
      await api.deleteFoodEntry(id);
      fetchDayData(currentDate);
    } catch (err: any) {
      alert(`Could not delete: ${err.message}`);
    }
  };

  const mealCategories = ['breakfast', 'lunch', 'dinner', 'snack'] as const;

  const categoryThemes: Record<string, { card: string; badge: string; link: string; inner: string }> = {
    breakfast: {
      card: 'bg-gradient-to-br from-[#281805]/85 via-[#1a1106]/90 to-[#0c0a07]/95 border-amber-500/40 hover:border-amber-400 hover:shadow-2xl hover:shadow-amber-500/10',
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      link: 'text-amber-400',
      inner: 'bg-black/50 border-amber-500/20',
    },
    lunch: {
      card: 'bg-gradient-to-br from-[#072a17]/85 via-[#051a0f]/90 to-[#040e08]/95 border-emerald-500/40 hover:border-emerald-400 hover:shadow-2xl hover:shadow-emerald-500/10',
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      link: 'text-emerald-400',
      inner: 'bg-black/50 border-emerald-500/20',
    },
    dinner: {
      card: 'bg-gradient-to-br from-[#0c1636]/85 via-[#080f24]/90 to-[#050914]/95 border-indigo-500/40 hover:border-indigo-400 hover:shadow-2xl hover:shadow-indigo-500/10',
      badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
      link: 'text-indigo-400',
      inner: 'bg-black/50 border-indigo-500/20',
    },
    snack: {
      card: 'bg-gradient-to-br from-[#2e0814]/85 via-[#1d060e]/90 to-[#0e070a]/95 border-rose-500/40 hover:border-rose-400 hover:shadow-2xl hover:shadow-rose-500/10',
      badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      link: 'text-rose-400',
      inner: 'bg-black/50 border-rose-500/20',
    },
  };

  const formattedDate = new Date(currentDate + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Header & Date Navigator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Food Diary</h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
            Review and manage your daily recorded meals and macronutrient distributions.
          </p>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-2 bg-[#0d0d12] p-2 rounded-2xl border border-zinc-800/90 shadow-md self-start sm:self-auto">
          <button
            onClick={handlePrevDay}
            className="p-2 hover:bg-zinc-800/60 rounded-xl text-zinc-300 transition-colors cursor-pointer"
            title="Previous Day"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="text-sm font-bold text-white px-3 min-w-[150px] text-center">
            {formattedDate}
          </span>

          <button
            onClick={handleNextDay}
            className="p-2 hover:bg-zinc-800/60 rounded-xl text-zinc-300 transition-colors cursor-pointer"
            title="Next Day"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <button
            onClick={handleToday}
            className="ml-1 text-xs font-bold text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
          >
            Today
          </button>
        </div>
      </div>

      {/* Day Overview Strip: Royal Gold Onyx */}
      {summary && (
        <div className="bg-gradient-to-r from-[#221603]/90 via-[#140e02]/95 to-[#0b0a06] rounded-3xl p-6 border border-amber-500/40 shadow-2xl grid grid-cols-2 sm:grid-cols-5 gap-4 text-center backdrop-blur-xs">
          <div className="col-span-2 sm:col-span-1 border-b sm:border-b-0 sm:border-r border-amber-500/20 pb-3 sm:pb-0">
            <span className="text-xs font-black text-amber-300 uppercase tracking-wider block mb-1">Calories</span>
            <span className="text-3xl font-black text-white">{Math.round(summary.total_calories)}</span>
            <span className="text-xs text-zinc-300 font-medium block mt-0.5">/ {Math.round(summary.calorie_target)} kcal</span>
          </div>
          <div>
            <span className="text-xs font-black text-zinc-300 uppercase tracking-wider block mb-1">Protein</span>
            <span className="text-2xl font-black text-amber-400">{Math.round(summary.protein.current)}g</span>
            <span className="text-xs text-zinc-300 font-medium block mt-0.5">/ {Math.round(summary.protein.target)}g</span>
          </div>
          <div>
            <span className="text-xs font-black text-zinc-300 uppercase tracking-wider block mb-1">Carbs</span>
            <span className="text-2xl font-black text-amber-300">{Math.round(summary.carbs.current)}g</span>
            <span className="text-xs text-zinc-300 font-medium block mt-0.5">/ {Math.round(summary.carbs.target)}g</span>
          </div>
          <div>
            <span className="text-xs font-black text-zinc-300 uppercase tracking-wider block mb-1">Fat</span>
            <span className="text-2xl font-black text-yellow-400">{Math.round(summary.fat.current)}g</span>
            <span className="text-xs text-zinc-300 font-medium block mt-0.5">/ {Math.round(summary.fat.target)}g</span>
          </div>
          <div>
            <span className="text-xs font-black text-zinc-300 uppercase tracking-wider block mb-1">Fiber</span>
            <span className="text-2xl font-black text-emerald-400">{Math.round(summary.fiber.current)}g</span>
            <span className="text-xs text-zinc-300 font-medium block mt-0.5">/ {Math.round(summary.fiber.target)}g</span>
          </div>
        </div>
      )}

      {/* Meal Categories Sections */}
      {isLoading ? (
        <div className="py-12 text-center text-sm font-medium text-zinc-400">Loading meals...</div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {mealCategories.map((category) => {
            const catEntries = entries.filter((e) => e.meal_category.toLowerCase() === category);
            const catTotalCal = catEntries.reduce((sum, e) => sum + e.calories, 0);
            const catTotalProt = catEntries.reduce((sum, e) => sum + e.protein_g, 0);
            const theme = categoryThemes[category] || categoryThemes.breakfast;

            return (
              <div key={category} className={`${theme.card} rounded-3xl p-6 border shadow-xl space-y-4 backdrop-blur-xs transition-all`}>
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-lg font-black text-white capitalize">{category}</h3>
                    <span className="text-xs font-bold text-zinc-300">({catEntries.length} items)</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-zinc-200">{Math.round(catTotalCal)} kcal</span>
                    <span className={`text-xs font-bold px-3 py-0.5 rounded-full border ${theme.badge}`}>
                      {Math.round(catTotalProt)}g Protein
                    </span>
                    <Link
                      to={`/food-logging?meal=${category}`}
                      className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                      title={`Add to ${category}`}
                    >
                      <PlusCircle className="w-5 h-5 text-amber-400" />
                    </Link>
                  </div>
                </div>

                {catEntries.length === 0 ? (
                  <div className="py-5 text-center text-sm text-zinc-300">
                    <span>No {category} recorded. </span>
                    <Link
                      to={`/food-logging?meal=${category}`}
                      className={`${theme.link} font-bold hover:underline`}
                    >
                      + Log {category}
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {catEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className={`p-4 rounded-2xl ${theme.inner} border flex items-center justify-between hover:bg-black/70 transition-colors group`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white">{entry.food_name}</h4>
                            {entry.source === 'gemini_vision' && (
                              <span className="text-xs font-bold bg-amber-950/70 text-amber-300 border border-amber-800/50 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-amber-400" /> AI Scan
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-zinc-300 font-medium mt-0.5">
                            {entry.quantity} {entry.unit} ({Math.round(entry.serving_weight_g)}g)
                            {entry.notes && ` • "${entry.notes}"`}
                          </p>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <span className="text-sm font-black text-white">{Math.round(entry.calories)} kcal</span>
                            <div className="text-xs text-zinc-300 font-semibold flex items-center gap-2 mt-0.5">
                              <span>P: {entry.protein_g}g</span>
                              <span>C: {entry.carbs_g}g</span>
                              <span>F: {entry.fat_g}g</span>
                              <span>Fib: {entry.fiber_g}g</span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleDeleteEntry(entry.id)}
                            className="p-2 text-zinc-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer opacity-70 group-hover:opacity-100"
                            title="Delete entry"
                          >
                            <Trash2 className="w-4.5 h-4.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <MedicalDisclaimer compact />
    </div>
  );
};
