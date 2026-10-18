import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { MealPlan } from '../types';
import { useAuth } from '../context/AuthContext';
import { MedicalDisclaimer } from '../components/MedicalDisclaimer';
import {
  Sparkles,
  CalendarCheck2,
  ShoppingCart,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Flame,
  Fish,
  Wheat,
  Cookie,
  ChefHat,
  ArrowRight,
} from 'lucide-react';

export const MealPlannerPage: React.FC = () => {
  const { profile } = useAuth();
  const [currentPlan, setCurrentPlan] = useState<MealPlan | null>(null);
  const [savedPlans, setSavedPlans] = useState<MealPlan[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAddingToDiary, setIsAddingToDiary] = useState(false);
  const [isBuildingGrocery, setIsBuildingGrocery] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Form custom requests
  const [budget, setBudget] = useState<number>(profile?.daily_budget_inr || 250);
  const [customRequest, setCustomRequest] = useState('');

  const loadPlans = async () => {
    try {
      const plans = await api.listMealPlans();
      setSavedPlans(plans);
      if (plans.length > 0 && !currentPlan) {
        setCurrentPlan(plans[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setActionSuccess(null);
    try {
      const newPlan = await api.generateMealPlan({
        budget_inr: budget,
        custom_requests: customRequest || undefined,
      });
      setCurrentPlan(newPlan);
      setActionSuccess('Fresh personalized meal plan generated!');
      await loadPlans();
    } catch (err: any) {
      alert(`Could not generate meal plan: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddToDiary = async () => {
    if (!currentPlan) return;
    setIsAddingToDiary(true);
    setActionSuccess(null);
    try {
      const res = await api.addPlanToDiary(currentPlan.id);
      setActionSuccess(res.message);
    } catch (err: any) {
      alert(`Could not log plan to diary: ${err.message}`);
    } finally {
      setIsAddingToDiary(false);
    }
  };

  const handleCreateGrocery = async () => {
    if (!currentPlan) return;
    setIsBuildingGrocery(true);
    setActionSuccess(null);
    try {
      const res = await api.generateGroceryList(currentPlan.id);
      setActionSuccess(`${res.message} Click 'Grocery List' to view your shopping aisles.`);
    } catch (err: any) {
      alert(`Could not generate grocery list: ${err.message}`);
    } finally {
      setIsBuildingGrocery(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Smart AI Meal Planner</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Balanced Indian & global meal ideas tailored to your budget, allergies, and calorie goals.
          </p>
        </div>

        <Link
          to="/grocery-list"
          className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-4 py-2 rounded-2xl border border-slate-200 text-xs shadow-sm transition-all self-start sm:self-auto"
        >
          <ShoppingCart className="w-4 h-4 text-emerald-600" />
          <span>View Grocery List</span>
        </Link>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span className="font-semibold">{actionSuccess}</span>
        </div>
      )}

      {/* Generator Control Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Configure AI Meal Generator</h3>
              <p className="text-xs text-slate-400">
                Adhering to: {profile?.dietary_preference || 'Vegetarian'} • Target: ~{profile?.daily_calorie_target || 2000} kcal
              </p>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-2xl text-xs shadow-md shadow-emerald-600/20 transition-all disabled:opacity-60"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Designing Meals with Gemini...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>Generate New Daily Plan</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Daily Grocery Budget (₹ INR)
            </label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value) || 250)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Custom Requests / Preferences
            </label>
            <input
              type="text"
              value={customRequest}
              onChange={(e) => setCustomRequest(e.target.value)}
              placeholder="e.g. Include high-protein breakfast like besan chilla, light dinner"
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>
      </div>

      {/* Active Meal Plan Display */}
      {currentPlan ? (
        <div className="space-y-6">
          {/* Plan Header Strip */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-emerald-400 text-xs font-semibold mb-1">
                <ChefHat className="w-4 h-4" /> Recommended Menu
              </div>
              <h2 className="text-xl sm:text-2xl font-bold">{currentPlan.title}</h2>
              {currentPlan.notes && <p className="text-xs text-slate-300 mt-1">{currentPlan.notes}</p>}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleAddToDiary}
                disabled={isAddingToDiary}
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-colors shadow-sm disabled:opacity-60"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{isAddingToDiary ? 'Logging...' : 'Add Plan to Diary'}</span>
              </button>

              <button
                onClick={handleCreateGrocery}
                disabled={isBuildingGrocery}
                className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-4 py-2.5 rounded-xl text-xs transition-colors border border-slate-700 disabled:opacity-60"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{isBuildingGrocery ? 'Creating...' : 'Generate Grocery List'}</span>
              </button>
            </div>
          </div>

          {/* Meals Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentPlan.items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                      {item.meal_category}
                    </span>
                    <span className="text-xs font-black text-slate-900">
                      {Math.round(item.estimated_calories)} kcal
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mt-1">{item.food_name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Portion: {item.portion_description}</p>

                  {/* Nutrients preview */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl text-center text-xs font-semibold text-slate-700 my-3">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Protein</span>
                      {item.protein_g}g
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Carbs</span>
                      {item.carbs_g}g
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Fat</span>
                      {item.fat_g}g
                    </div>
                  </div>

                  {/* Recipe / Instructions */}
                  {item.recipe_instructions && (
                    <div className="text-xs text-slate-600 bg-amber-50/50 p-3 rounded-xl border border-amber-100">
                      <span className="font-bold text-amber-900 block mb-0.5">Quick Preparation:</span>
                      {item.recipe_instructions}
                    </div>
                  )}
                </div>

                {/* Ingredients chips */}
                {item.ingredients && item.ingredients.length > 0 && (
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Key Ingredients:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {item.ingredients.map((ing, i) => (
                        <span key={i} className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-lg">
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm max-w-md mx-auto">
          <CalendarCheck2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">No Active Meal Plan</h3>
          <p className="text-xs text-slate-500 mb-6">
            Click 'Generate New Daily Plan' above to create a culturally aligned, nutrient-balanced menu with Gemini.
          </p>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
          >
            Create My Plan Now
          </button>
        </div>
      )}

      <MedicalDisclaimer />
    </div>
  );
};
