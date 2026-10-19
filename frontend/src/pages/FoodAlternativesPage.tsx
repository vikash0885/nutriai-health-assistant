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
    <div className="w-full space-y-6 pb-12">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Eat This, Try This
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Nutritional upgrade engine: discover healthy, culturally attuned, budget-friendly swaps without food shaming.
        </p>
      </div>

      {/* Search & Suggestions */}
      <div className="bg-[#0d0d12] rounded-3xl p-6 border border-zinc-800/90 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={foodQuery}
              onChange={(e) => setFoodQuery(e.target.value)}
              placeholder="Enter any meal or snack (e.g. Samosa, White Rice, Puri Bhaji)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/60 border border-zinc-800 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 text-white placeholder:text-zinc-600"
            />
          </div>

          <button
            onClick={() => handleFetchAlternatives(foodQuery)}
            disabled={isLoading || !foodQuery.trim()}
            className="px-6 py-2.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-black rounded-xl text-xs font-extrabold shadow-lg shadow-amber-500/20 gold-box-glow transition-all flex items-center justify-center gap-1.5 disabled:opacity-60 cursor-pointer"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
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
          <span className="text-[11px] font-semibold text-zinc-500 block mb-2">Try an example:</span>
          <div className="flex flex-wrap gap-2">
            {sampleFoods.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => handleFetchAlternatives(f)}
                className="text-xs bg-black/60 hover:bg-amber-950/40 text-zinc-300 hover:text-amber-300 border border-zinc-800 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="py-12 text-center text-xs text-zinc-500">
          <div className="w-8 h-8 border-4 border-amber-500/20 border-t-amber-400 rounded-full animate-spin mx-auto mb-2" />
          <span>Generating smart nutritional alternatives with SehatSense AI...</span>
        </div>
      ) : alternatives.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white">
            Suggested Upgrades for "{foodQuery}"
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {alternatives.map((alt, idx) => (
              <div
                key={idx}
                className="bg-[#0d0d12] rounded-3xl p-6 border border-zinc-800/90 shadow-xl flex flex-col justify-between space-y-4 hover:border-amber-500/40 transition-all"
              >
                <div className="space-y-3">
                  {/* Food Swap Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-zinc-500 block">Current Food</span>
                      <span className="text-xs font-semibold text-zinc-300">{alt.original_food}</span>
                      <span className="text-[10px] text-zinc-500 block">{alt.current_nutrients}</span>
                    </div>

                    <ArrowLeftRight className="w-5 h-5 text-amber-400 flex-shrink-0" />

                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-amber-400 block">Try This</span>
                      <span className="text-xs font-bold text-white">{alt.suggested_alternative}</span>
                      <span className="text-[10px] text-amber-300 font-semibold block">{alt.alternative_nutrients}</span>
                    </div>
                  </div>

                  {/* Why Better */}
                  <div className="bg-amber-950/20 p-3.5 rounded-2xl border border-amber-900/30 text-xs text-zinc-300 space-y-1">
                    <span className="font-bold text-amber-300 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-amber-400" /> Why this works:
                    </span>
                    <p className="leading-relaxed text-zinc-400">{alt.why_better}</p>
                  </div>

                  {/* Budget & Portion */}
                  <div className="space-y-2 text-xs text-zinc-400">
                    <div className="flex items-start gap-2">
                      <Tag className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-zinc-200">Affordability:</strong> {alt.budget_friendly_note}
                      </span>
                    </div>

                    <div className="flex items-start gap-2">
                      <Scale className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-zinc-200">Portion Tip:</strong> {alt.portion_tip}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-800 text-[11px] text-zinc-500">
                  Cultural Foods Philosophy: Foods are neither good nor evil. Portions, cooking oils, and meal combinations shape balance.
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : hasSearched ? (
        <div className="text-center py-8 text-xs text-zinc-500">
          No alternative suggestions returned. Try searching for a common staple like "Samosa" or "White Rice".
        </div>
      ) : null}

      <MedicalDisclaimer />
    </div>
  );
};
