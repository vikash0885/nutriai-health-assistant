import React, { useState } from 'react';
import { api } from '../services/api';
import { FoodAlternative } from '../types';
import { MedicalDisclaimer } from '../components/MedicalDisclaimer';
import {
  ArrowLeftRight,
  Search,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Tag,
  Scale,
} from 'lucide-react';

export const FoodAlternativesPage: React.FC = () => {
  const [foodQuery, setFoodQuery] = useState('Samosa');
  const [alternatives, setAlternatives] = useState<FoodAlternative[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const sampleFoods = [
    'Samosa',
    'Plain White Rice with Potato',
    'Sugary Masala Chai with Biscuits',
    'Aloo Paratha with Butter',
    'White Bread with Jam',
    'Instant Noodles',
  ];

  const handleFetchAlternatives = async (food: string) => {
    setFoodQuery(food);
    setIsLoading(true);
    setHasSearched(true);
    try {
      const data = await api.getFoodAlternatives(food);
      setAlternatives(data);
    } catch (err: any) {
      alert(`Could not fetch alternatives: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Eat This, Try This
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Nutritional upgrade engine: discover healthy, culturally attuned, budget-friendly swaps without food shaming.
        </p>
      </div>

      {/* Search & Suggestions */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={foodQuery}
              onChange={(e) => setFoodQuery(e.target.value)}
              placeholder="Enter any meal or snack (e.g. Samosa, White Rice, Puri Bhaji)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
            />
          </div>

          <button
            onClick={() => handleFetchAlternatives(foodQuery)}
            disabled={isLoading || !foodQuery.trim()}
            className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold shadow-md shadow-violet-600/20 transition-all flex items-center justify-center gap-1.5 disabled:opacity-60"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Find Smart Swaps</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Click presets */}
        <div>
          <span className="text-[11px] font-semibold text-slate-400 block mb-2">Try an example:</span>
          <div className="flex flex-wrap gap-2">
            {sampleFoods.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => handleFetchAlternatives(f)}
                className="text-xs bg-slate-50 hover:bg-violet-50 text-slate-700 hover:text-violet-800 border border-slate-200 px-3 py-1.5 rounded-full transition-colors"
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="py-12 text-center text-xs text-slate-400">
          <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto mb-2" />
          <span>Generating smart nutritional alternatives with NutriAi-VM...</span>
        </div>
      ) : alternatives.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900">
            Suggested Upgrades for "{foodQuery}"
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {alternatives.map((alt, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4 hover:border-violet-200 transition-all"
              >
                <div className="space-y-3">
                  {/* Food Swap Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Food</span>
                      <span className="text-xs font-semibold text-slate-600">{alt.original_food}</span>
                      <span className="text-[10px] text-slate-400 block">{alt.current_nutrients}</span>
                    </div>

                    <ArrowLeftRight className="w-5 h-5 text-violet-600 flex-shrink-0" />

                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-violet-600 block">Try This</span>
                      <span className="text-xs font-bold text-slate-900">{alt.suggested_alternative}</span>
                      <span className="text-[10px] text-violet-700 font-semibold block">{alt.alternative_nutrients}</span>
                    </div>
                  </div>

                  {/* Why Better */}
                  <div className="bg-violet-50/70 p-3.5 rounded-2xl border border-violet-100 text-xs text-slate-700 space-y-1">
                    <span className="font-bold text-violet-950 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-violet-600" /> Why this works:
                    </span>
                    <p className="leading-relaxed text-slate-600">{alt.why_better}</p>
                  </div>

                  {/* Budget & Portion */}
                  <div className="space-y-2 text-xs text-slate-600">
                    <div className="flex items-start gap-2">
                      <Tag className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-slate-800">Affordability:</strong> {alt.budget_friendly_note}
                      </span>
                    </div>

                    <div className="flex items-start gap-2">
                      <Scale className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-slate-800">Portion Tip:</strong> {alt.portion_tip}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                  Cultural Foods Philosophy: Foods are neither good nor evil. Portions, cooking oils, and meal combinations shape balance.
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : hasSearched ? (
        <div className="text-center py-8 text-xs text-slate-400">
          No alternative suggestions returned. Try searching for a common staple like "Samosa" or "White Rice".
        </div>
      ) : null}

      <MedicalDisclaimer />
    </div>
  );
};
