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

  const formattedDate = new Date(currentDate + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header & Date Navigator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Food Diary</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Review and manage your daily recorded meals and macronutrient distributions.
          </p>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-sm self-start sm:self-auto">
          <button
            onClick={handlePrevDay}
            className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors"
            title="Previous Day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-bold text-slate-800 px-3 min-w-[140px] text-center">
            {formattedDate}
          </span>

          <button
            onClick={handleNextDay}
            className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors"
            title="Next Day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleToday}
            className="ml-1 text-[11px] font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200 px-2.5 py-1 rounded-xl transition-colors cursor-pointer"
          >
            Today
          </button>
        </div>
      </div>

      {/* Day Overview Strip */}
      {summary && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
          <div className="col-span-2 sm:col-span-1 border-b sm:border-b-0 sm:border-r border-slate-100 pb-3 sm:pb-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Calories</span>
            <span className="text-2xl font-black text-slate-900">{Math.round(summary.total_calories)}</span>
            <span className="text-[11px] text-slate-400 block">/ {Math.round(summary.calorie_target)} kcal</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Protein</span>
            <span className="text-lg font-bold text-violet-700">{Math.round(summary.protein.current)}g</span>
            <span className="text-[11px] text-slate-400 block">/ {Math.round(summary.protein.target)}g</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Carbs</span>
            <span className="text-lg font-bold text-amber-700">{Math.round(summary.carbs.current)}g</span>
            <span className="text-[11px] text-slate-400 block">/ {Math.round(summary.carbs.target)}g</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Fat</span>
            <span className="text-lg font-bold text-rose-700">{Math.round(summary.fat.current)}g</span>
            <span className="text-[11px] text-slate-400 block">/ {Math.round(summary.fat.target)}g</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Fiber</span>
            <span className="text-lg font-bold text-indigo-700">{Math.round(summary.fiber.current)}g</span>
            <span className="text-[11px] text-slate-400 block">/ {Math.round(summary.fiber.target)}g</span>
          </div>
        </div>
      )}

      {/* Meal Categories Sections */}
      {isLoading ? (
        <div className="py-12 text-center text-xs text-slate-400">Loading meals...</div>
      ) : (
        <div className="space-y-6">
          {mealCategories.map((category) => {
            const catEntries = entries.filter((e) => e.meal_category.toLowerCase() === category);
            const catTotalCal = catEntries.reduce((sum, e) => sum + e.calories, 0);
            const catTotalProt = catEntries.reduce((sum, e) => sum + e.protein_g, 0);

            return (
              <div key={category} className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 capitalize">{category}</h3>
                    <span className="text-xs font-semibold text-slate-400">({catEntries.length} items)</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-700">{Math.round(catTotalCal)} kcal</span>
                    <span className="text-xs font-semibold text-violet-700 bg-violet-50 border border-violet-200 px-2 py-0.5 rounded-full">
                      {Math.round(catTotalProt)}g Protein
                    </span>
                    <Link
                      to={`/food-logging?meal=${category}`}
                      className="p-1 text-violet-600 hover:text-violet-700 hover:bg-violet-50 rounded-lg transition-colors cursor-pointer"
                      title={`Add to ${category}`}
                    >
                      <PlusCircle className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {catEntries.length === 0 ? (
                  <div className="py-4 text-center text-xs text-slate-400">
                    <span>No {category} recorded. </span>
                    <Link
                      to={`/food-logging?meal=${category}`}
                      className="text-violet-600 font-semibold hover:underline"
                    >
                      + Log {category}
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {catEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between hover:bg-slate-100/60 transition-colors group"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-slate-900">{entry.food_name}</h4>
                            {entry.source === 'gemini_vision' && (
                              <span className="text-[9px] font-semibold bg-violet-100 text-violet-800 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                <Sparkles className="w-2.5 h-2.5 text-violet-600" /> AI Scan
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400">
                            {entry.quantity} {entry.unit} ({Math.round(entry.serving_weight_g)}g)
                            {entry.notes && ` • "${entry.notes}"`}
                          </p>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <span className="text-xs font-bold text-slate-800">{Math.round(entry.calories)} kcal</span>
                            <div className="text-[10px] text-slate-400 flex items-center gap-2">
                              <span>P: {entry.protein_g}g</span>
                              <span>C: {entry.carbs_g}g</span>
                              <span>F: {entry.fat_g}g</span>
                              <span>Fib: {entry.fiber_g}g</span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleDeleteEntry(entry.id)}
                            className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors opacity-70 group-hover:opacity-100"
                            title="Delete entry"
                          >
                            <Trash2 className="w-4 h-4" />
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
