import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { DashboardData } from '../types';
import { ProgressRing } from '../components/ProgressRing';
import { MacroCard } from '../components/MacroCard';
import { MedicalDisclaimer } from '../components/MedicalDisclaimer';
import {
  UtensilsCrossed,
  Droplet,
  Dumbbell,
  Sparkles,
  PlusCircle,
  Camera,
  ActivitySquare,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  ChevronRight,
  Flame,
  Wheat,
  Fish,
  Cookie,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [weeklyTrend, setWeeklyTrend] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    try {
      setIsLoading(true);
      const [dash, week] = await Promise.all([
        api.getDashboardSummary(),
        api.getWeeklySummary(),
      ]);
      setData(dash);
      setWeeklyTrend(week.days);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleQuickWater = async (amount: number) => {
    try {
      await api.logWater(amount);
      fetchDashboard();
    } catch (err: any) {
      alert(`Could not log water: ${err.message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-500">Calculating your daily intelligence...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center max-w-md mx-auto">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-900 mb-1">Could not load dashboard</h3>
        <p className="text-xs text-slate-500 mb-4">{error}</p>
        <button
          onClick={fetchDashboard}
          className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  const { today_nutrition, hydration, activity, user, recent_meals, recent_symptoms, pattern_insights, habit_insights } = data;
  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-200 text-xs font-semibold mb-1">
            <span>{todayFormatted}</span>
            <span>•</span>
            <span className="capitalize">{user.dietary_preference} Plan</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Namaste, {user.display_name}!
          </h1>
          <p className="text-emerald-100/90 text-xs sm:text-sm mt-1 max-w-xl">
            {today_nutrition.entry_count > 0
              ? `You've logged ${today_nutrition.entry_count} food items today. Stay mindful of hydration and your fiber intake!`
              : "No meals recorded yet today. Snap a photo or log your breakfast to start tracking your energy!"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/food-logging"
            className="inline-flex items-center gap-2 bg-white text-emerald-800 hover:bg-emerald-50 px-4 py-2.5 rounded-2xl text-xs font-bold shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4 text-emerald-600" />
            <span>Log Food</span>
          </Link>
          <Link
            to="/food-logging?tab=image"
            className="inline-flex items-center gap-2 bg-emerald-500/30 hover:bg-emerald-500/40 text-white border border-emerald-400/40 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all"
          >
            <Camera className="w-4 h-4" />
            <span>AI Camera</span>
          </Link>
        </div>
      </div>

      {/* Daily Progress Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calorie Ring Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col items-center justify-center text-center">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
            Daily Calorie Intake
          </h3>
          <ProgressRing
            progress={today_nutrition.calorie_percentage}
            size={160}
            strokeWidth={14}
            colorClass="text-emerald-500"
            bgColorClass="text-slate-100"
          >
            <Flame className="w-6 h-6 text-emerald-600 mb-1" />
            <span className="text-2xl font-black text-slate-900 leading-tight">
              {Math.round(today_nutrition.total_calories)}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              / {Math.round(today_nutrition.calorie_target)} kcal
            </span>
          </ProgressRing>
          <p className="text-xs text-slate-500 mt-4">
            {today_nutrition.calorie_target - today_nutrition.total_calories > 0
              ? `${Math.round(today_nutrition.calorie_target - today_nutrition.total_calories)} kcal remaining to target`
              : 'Target reached for today'}
          </p>
        </div>

        {/* Hydration Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
                <Droplet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Hydration</h3>
                <p className="text-xs text-slate-400">{hydration.glasses} glasses consumed</p>
              </div>
            </div>
            <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full">
              {Math.round(hydration.percentage)}%
            </span>
          </div>

          <div className="my-4">
            <div className="flex items-baseline justify-between mb-1.5">
              <span className="text-2xl font-black text-slate-900">{hydration.total_ml} ml</span>
              <span className="text-xs text-slate-400">Target: {hydration.target_ml} ml</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div
                className="bg-sky-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(hydration.percentage, 100)}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <span className="text-xs text-slate-400 font-medium mr-1">Quick Add:</span>
            {[250, 500, 750].map((amt) => (
              <button
                key={amt}
                onClick={() => handleQuickWater(amt)}
                className="flex-1 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-xl text-xs font-semibold transition-colors"
              >
                +{amt}ml
              </button>
            ))}
          </div>
        </div>

        {/* Activity & Digestion Stroll Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <Dumbbell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Physical Activity</h3>
                <p className="text-xs text-slate-400">{activity.sessions_count} logged sessions</p>
              </div>
            </div>
            <Link
              to="/exercise"
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center"
            >
              Log <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="my-4 grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl">
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Total Duration</span>
              <span className="text-xl font-bold text-slate-900">{activity.total_minutes} mins</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Calories Burned</span>
              <span className="text-xl font-bold text-slate-900">{Math.round(activity.calories_burned)} kcal</span>
            </div>
          </div>

          <div className="text-xs text-slate-500 bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/50 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>Gentle 15-min post-meal stroll supports smooth digestion.</span>
          </div>
        </div>
      </div>

      {/* Macronutrients Progress Row */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-slate-900">Macronutrients Breakdown</h2>
          <Link to="/nutrition" className="text-xs font-semibold text-emerald-600 hover:underline">
            Detailed Analysis
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MacroCard
            label="Protein"
            data={today_nutrition.protein}
            color="emerald"
            icon={<Fish className="w-4 h-4" />}
          />
          <MacroCard
            label="Carbohydrates"
            data={today_nutrition.carbs}
            color="amber"
            icon={<Wheat className="w-4 h-4" />}
          />
          <MacroCard
            label="Healthy Fats"
            data={today_nutrition.fat}
            color="rose"
            icon={<Cookie className="w-4 h-4" />}
          />
          <MacroCard
            label="Dietary Fiber"
            data={today_nutrition.fiber}
            color="purple"
            icon={<Sparkles className="w-4 h-4" />}
          />
        </div>
      </div>

      {/* Weekly Nutrition Chart & Recent Meals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Trend Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">7-Day Caloric Intake vs Target</h3>
              <p className="text-xs text-slate-400">Actual daily consumption recorded in your diary</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              Weekly Trend
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day_name" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="calories" fill="#10b981" radius={[6, 6, 0, 0]} name="Calories (kcal)" />
                <Line type="monotone" dataKey="calorie_target" stroke="#94a3b8" strokeDasharray="4 4" dot={false} name="Target" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Meals Feed */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">Today's Logged Meals</h3>
              <Link to="/food-diary" className="text-xs font-semibold text-emerald-600 hover:underline">
                View Diary
              </Link>
            </div>

            {recent_meals.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <UtensilsCrossed className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-xs font-medium">No meals logged yet today.</p>
                <Link
                  to="/food-logging"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs text-emerald-600 font-semibold hover:underline"
                >
                  <PlusCircle className="w-3.5 h-3.5" /> Log your first meal
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recent_meals.map((m) => (
                  <div key={m.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{m.food_name}</h4>
                      <p className="text-[11px] text-slate-400 capitalize">
                        {m.meal_category} • {m.portion}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-800">{Math.round(m.calories)} kcal</span>
                      <p className="text-[10px] text-emerald-600 font-semibold">{m.protein_g}g Pro</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Link
            to="/food-logging"
            className="w-full mt-4 py-2.5 rounded-xl border border-dashed border-slate-300 text-xs font-semibold text-slate-600 hover:text-emerald-700 hover:border-emerald-300 transition-colors flex items-center justify-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" /> Add Food Entry
          </Link>
        </div>
      </div>

      {/* Pattern Insights & Habit Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Symptom Pattern Insights */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Food & Symptom Pattern Insights</h3>
            </div>
            <Link to="/patterns" className="text-xs font-semibold text-emerald-600 hover:underline">
              Analyze Logs
            </Link>
          </div>

          {pattern_insights.length === 0 ? (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-500">
              <p className="font-semibold text-slate-700 mb-1">No symptom patterns detected yet.</p>
              <p className="leading-relaxed">
                Log your meals and any digestive feelings (bloating, acidity) in the Symptom Diary.
                NutriAI will automatically identify repeated associations.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pattern_insights.map((ins) => (
                <div key={ins.id} className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-purple-900">{ins.title}</span>
                    <span className="text-[10px] font-semibold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full capitalize">
                      {ins.confidence} confidence
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-2">{ins.description}</p>
                  {ins.actionable_tip && (
                    <p className="text-[11px] text-purple-800 font-medium bg-purple-100/60 p-2 rounded-lg">
                      💡 Tip: {ins.actionable_tip}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Habit Insights */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Your Habit Insights</h3>
            </div>
            <Link to="/habits" className="text-xs font-semibold text-emerald-600 hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {habit_insights.map((h, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-100">
                <h4 className="text-xs font-bold text-emerald-950 mb-1">{h.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-2">{h.description}</p>
                {h.actionable_tip && (
                  <p className="text-[11px] text-emerald-800 font-semibold bg-emerald-100/60 p-2 rounded-lg">
                    Action to consider: {h.actionable_tip}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <MedicalDisclaimer />
    </div>
  );
};
