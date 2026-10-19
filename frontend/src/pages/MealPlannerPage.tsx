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
    <div className="w-full space-y-6 pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Smart AI Meal Planner</h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
            Balanced Indian & global meal ideas tailored to your budget, allergies, and calorie goals.
          </p>
        </div>

        <Link
          to="/grocery-list"
          className="inline-flex items-center gap-2 bg-[#0d0d12] hover:bg-zinc-800 text-zinc-300 font-semibold px-4 py-2 rounded-2xl border border-zinc-800 text-xs shadow-sm transition-all self-start sm:self-auto cursor-pointer"
        >
          <ShoppingCart className="w-4 h-4 text-amber-400" />
          <span>View Grocery List</span>
        </Link>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span className="font-semibold">{actionSuccess}</span>
        </div>
      )}

      {/* Generator Control Card */}
      <div className="bg-[#0d0d12] rounded-3xl p-6 border border-zinc-800/90 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-950/60 border border-amber-800/50 text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Configure AI Meal Generator</h3>
              <p className="text-xs text-zinc-400">
                Adhering to: {profile?.dietary_preference || 'Vegetarian'} • Target: ~{profile?.daily_calorie_target || 2000} kcal
              </p>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-black font-extrabold px-5 py-2.5 rounded-2xl text-xs shadow-lg shadow-amber-500/20 gold-box-glow transition-all disabled:opacity-60 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                <span>Designing Your Meal Plan...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>Generate New Daily Plan</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-zinc-800">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Daily Grocery Budget (₹ INR)
            </label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value) || 250)}
              className="w-full p-2.5 rounded-xl bg-black/60 border border-zinc-800 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Custom Requests / Preferences
            </label>
            <input
              type="text"
              value={customRequest}
              onChange={(e) => setCustomRequest(e.target.value)}
              placeholder="e.g. Include high-protein breakfast like besan chilla, light dinner"
              className="w-full p-2.5 rounded-xl bg-black/60 border border-zinc-800 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 text-white placeholder:text-zinc-600"
            />
          </div>
        </div>
      </div>

      {/* Active Meal Plan Display */}
      {currentPlan ? (
        <div className="space-y-6">
          {/* Plan Header Strip */}
          <div className="bg-[#0c0c10] text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-amber-500/30">
            <div>
              <div className="inline-flex items-center gap-1.5 text-amber-400 text-xs font-semibold mb-1">
                <ChefHat className="w-4 h-4" /> Recommended Menu
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">{currentPlan.title}</h2>
              {currentPlan.notes && <p className="text-xs text-zinc-400 mt-1">{currentPlan.notes}</p>}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleAddToDiary}
                disabled={isAddingToDiary}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-extrabold px-4 py-2.5 rounded-xl text-xs transition-colors shadow-md disabled:opacity-60 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{isAddingToDiary ? 'Logging...' : 'Add Plan to Diary'}</span>
              </button>

              <button
                onClick={handleCreateGrocery}
                disabled={isBuildingGrocery}
                className="inline-flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold px-4 py-2.5 rounded-xl text-xs transition-colors border border-zinc-700 disabled:opacity-60 cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4 text-amber-400" />
                <span>{isBuildingGrocery ? 'Creating...' : 'Generate Grocery List'}</span>
              </button>
            </div>
          </div>

          {/* Meals Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentPlan.items.map((item) => (
              <div
                key={item.id}
                className="bg-[#0d0d12] rounded-3xl p-6 border border-zinc-800/90 shadow-xl flex flex-col justify-between space-y-4 hover:border-amber-500/40 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-300 bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-800/50">
                      {item.meal_category}
                    </span>
                    <span className="text-xs font-black text-white">
                      {Math.round(item.estimated_calories)} kcal
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mt-1">{item.food_name}</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">Portion: {item.portion_description}</p>

                  {/* Nutrients preview */}
                  <div className="grid grid-cols-3 gap-2 bg-black/60 border border-zinc-800 p-2.5 rounded-xl text-center text-xs font-semibold text-zinc-300 my-3">
                    <div>
                      <span className="text-[10px] text-zinc-500 block">Protein</span>
                      <span className="text-amber-400 font-bold">{item.protein_g}g</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 block">Carbs</span>
                      <span className="text-white font-semibold">{item.carbs_g}g</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 block">Fat</span>
                      <span className="text-white font-semibold">{item.fat_g}g</span>
                    </div>
                  </div>

                  {/* Recipe / Instructions */}
                  {item.recipe_instructions && (
                    <div className="text-xs text-zinc-300 bg-amber-950/20 p-3 rounded-xl border border-amber-900/30">
                      <span className="font-bold text-amber-300 block mb-0.5">Quick Preparation:</span>
                      {item.recipe_instructions}
                    </div>
                  )}
                </div>

                {/* Ingredients chips */}
                {item.ingredients && item.ingredients.length > 0 && (
                  <div className="pt-2 border-t border-zinc-800">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">
                      Key Ingredients:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {item.ingredients.map((ing, i) => (
                        <span key={i} className="text-[11px] bg-black/60 border border-zinc-800 text-zinc-300 px-2 py-0.5 rounded-lg">
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
        <div className="bg-[#0d0d12] rounded-3xl p-12 text-center border border-zinc-800/90 shadow-xl max-w-md mx-auto">
          <CalendarCheck2 className="w-12 h-12 text-amber-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No Active Meal Plan</h3>
          <p className="text-xs text-zinc-400 mb-6">
            Click 'Generate New Daily Plan' above to create a culturally aligned, nutrient-balanced menu with SehatSense AI.
          </p>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-6 py-2.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-black rounded-xl text-xs font-extrabold shadow-lg shadow-amber-500/20 gold-box-glow transition-all cursor-pointer"
          >
            Create My Plan Now
          </button>
        </div>
      )}

      <MedicalDisclaimer />
    </div>
  );
};
