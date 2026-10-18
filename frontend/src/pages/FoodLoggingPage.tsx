import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { FoodSearchItem } from '../types';
import { MedicalDisclaimer } from '../components/MedicalDisclaimer';
import {
  Camera,
  Search,
  Upload,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  Sparkles,
  Info,
  Clock,
  ArrowRight,
} from 'lucide-react';

export const FoodLoggingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialTab = searchParams.get('tab') === 'image' ? 'image' : 'manual';

  const [activeTab, setActiveTab] = useState<'manual' | 'image'>(initialTab);

  // Manual entry states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FoodSearchItem[]>([]);
  const [selectedFood, setSelectedFood] = useState<FoodSearchItem | null>(null);
  const [mealCategory, setMealCategory] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');
  const [quantity, setQuantity] = useState<number>(1);
  const [unit, setUnit] = useState<string>('serving');
  const [notes, setNotes] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [calculatedNutrients, setCalculatedNutrients] = useState<any>(null);

  // Image Upload states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [detectedItems, setDetectedItems] = useState<any[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  const [imageDisclaimer, setImageDisclaimer] = useState<string | null>(null);
  const [scanMessage, setScanMessage] = useState<string | null>(null);
  const [scanPerformed, setScanPerformed] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Search foods as user types
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length > 1) {
        setIsSearching(true);
        try {
          const res = await api.searchFoods(searchQuery);
          setSearchResults(res.items);
        } catch (err) {
          console.error(err);
        } finally {
          setIsSearching(false);
        }
      } else if (searchQuery.trim().length === 0) {
        // Load initial popular Indian foods
        const res = await api.searchFoods('');
        setSearchResults(res.items.slice(0, 10));
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Initial popular search on mount
  useEffect(() => {
    api.searchFoods('').then((res) => setSearchResults(res.items.slice(0, 8)));
  }, []);

  // Recalculate nutrients whenever food, quantity, or unit changes
  useEffect(() => {
    if (selectedFood) {
      api.calculatePortion({
        food_name: selectedFood.name,
        quantity: Number(quantity) || 1,
        unit: unit,
      }).then((calc) => {
        setCalculatedNutrients(calc);
      }).catch(console.error);
    }
  }, [selectedFood, quantity, unit]);

  const handleSelectFood = (item: FoodSearchItem) => {
    setSelectedFood(item);
    const defaultUnit = item.standard_units && item.standard_units.length > 0 ? item.standard_units[0].unit : 'serving';
    setUnit(defaultUnit);
    setQuantity(1);
  };

  const handleManualSave = async () => {
    if (!selectedFood && !searchQuery.trim()) return;

    setIsSaving(true);
    setSuccessMessage(null);
    try {
      const foodName = selectedFood ? selectedFood.name : searchQuery.trim();
      const calc = calculatedNutrients || {
        calories: 180,
        protein_g: 5,
        carbs_g: 25,
        fat_g: 5,
        fiber_g: 2,
        sugar_g: 2,
        sodium_mg: 150,
        serving_weight_g: 100,
        data_source: 'manual',
      };

      await api.createFoodEntry({
        food_name: foodName,
        meal_category: mealCategory,
        quantity: Number(quantity) || 1,
        unit: unit,
        serving_weight_g: calc.serving_weight_g,
        calories: calc.calories,
        protein_g: calc.protein_g,
        carbs_g: calc.carbs_g,
        fat_g: calc.fat_g,
        fiber_g: calc.fiber_g,
        sugar_g: calc.sugar_g,
        sodium_mg: calc.sodium_mg,
        source: calc.data_source || 'curated_database',
        confirmed_by_user: true,
        notes: notes || null,
      });

      setSuccessMessage(`Successfully logged ${foodName} to ${mealCategory}!`);
      setTimeout(() => {
        navigate('/food-diary');
      }, 1200);
    } catch (err: any) {
      alert(`Could not save food entry: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setDetectedItems([]);
      setImageError(null);
      setScanMessage(null);
      setScanPerformed(false);
    }
  };

  const handleScanImage = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setImageError(null);
    setScanMessage(null);
    setScanPerformed(true);
    try {
      const result = await api.uploadFoodImage(selectedFile);
      setDetectedItems(result.items || []);
      setImageDisclaimer(result.disclaimer);
      if (result.message) {
        setScanMessage(result.message);
      }
    } catch (err: any) {
      setImageError(
        err.message || 'Image analysis was unable to process this photo. Please use manual entry.'
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveDetectedItem = async (item: any) => {
    try {
      const nutrients = item.estimated_nutrients || {};
      await api.createFoodEntry({
        food_name: item.matched_food_name || item.detected_name,
        meal_category: mealCategory,
        quantity: 1.0,
        unit: 'serving',
        serving_weight_g: nutrients.serving_weight_g || 150.0,
        calories: nutrients.calories || 180.0,
        protein_g: nutrients.protein_g || 6.0,
        carbs_g: nutrients.carbs_g || 24.0,
        fat_g: nutrients.fat_g || 5.0,
        fiber_g: nutrients.fiber_g || 2.0,
        source: 'gemini_vision',
        confirmed_by_user: true,
        notes: `Detected via AI Vision: ${item.note || ''}`,
      });
      alert(`Logged ${item.detected_name} to your Food Diary!`);
    } catch (err: any) {
      alert(`Error saving item: ${err.message}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Log Food & Nutrients</h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Search over 120+ authentic Indian and global dishes or snap a photo with SehatSense AI Vision.
        </p>
      </div>

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span className="font-semibold">{successMessage}</span>
        </div>
      )}

      {/* Tabs Switcher */}
      <div className="flex bg-[#0d0d12] border border-zinc-800/90 p-1.5 rounded-2xl max-w-sm">
        <button
          onClick={() => setActiveTab('manual')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'manual'
              ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-black shadow-sm font-extrabold'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Manual Entry</span>
        </button>

        <button
          onClick={() => setActiveTab('image')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'image'
              ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-black shadow-sm font-extrabold'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>AI Photo Scan</span>
        </button>
      </div>

      {/* TAB 1: MANUAL ENTRY */}
      {activeTab === 'manual' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column: Search & Select */}
          <div className="md:col-span-7 bg-[#0d0d12] rounded-3xl p-6 border border-zinc-800/90 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Search className="w-4 h-4 text-amber-400" />
              <span>Search Database</span>
            </h3>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search roti, dal, paneer, poha, dosa, biryani..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-black/60 border border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all text-white placeholder:text-zinc-600"
              />
            </div>

            {/* Search Results list */}
            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
              {isSearching ? (
                <div className="text-center py-6 text-xs text-zinc-500">Searching nutrition records...</div>
              ) : searchResults.length === 0 ? (
                <div className="text-center py-6 text-xs text-zinc-500">
                  No exact dish found. You can still enter your dish name and estimate portion.
                </div>
              ) : (
                searchResults.map((item) => {
                  const isSel = selectedFood?.name === item.name;
                  return (
                    <div
                      key={item.name}
                      onClick={() => handleSelectFood(item)}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSel
                          ? 'border-amber-400 bg-amber-950/30 shadow-sm'
                          : 'border-zinc-800/80 bg-black/50 hover:bg-zinc-900/60'
                      }`}
                    >
                      <div>
                        <h4 className="text-xs font-bold text-white">{item.name}</h4>
                        <p className="text-[11px] text-zinc-400">
                          {item.hindi_name ? `${item.hindi_name} • ` : ''}
                          <span className="text-zinc-500">{item.category}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-zinc-200">{item.calories_per_100g} kcal</span>
                        <span className="text-[10px] text-zinc-500 block">per 100g</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Portion & Calculation Review */}
          <div className="md:col-span-5 bg-[#0d0d12] rounded-3xl p-6 border border-zinc-800/90 shadow-xl space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">Portion & Nutrients</h3>

              {/* Meal Category */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Meal Time</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['breakfast', 'lunch', 'snack', 'dinner'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setMealCategory(cat)}
                      className={`py-1.5 text-xs font-semibold rounded-xl capitalize transition-all cursor-pointer ${
                        mealCategory === cat
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-extrabold shadow-sm'
                          : 'bg-black/60 border border-zinc-800 text-zinc-400 hover:bg-zinc-800/60 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity and Unit */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Quantity</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.25"
                    max="50"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value) || 1)}
                    className="w-full p-2.5 rounded-xl bg-black/60 border border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Serving Unit</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-black/60 border border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all text-white"
                  >
                    {selectedFood && selectedFood.standard_units && selectedFood.standard_units.length > 0 ? (
                      selectedFood.standard_units.map((u) => (
                        <option key={u.unit} value={u.unit} className="bg-zinc-900 text-white">
                          {u.unit} ({u.grams}g)
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="serving" className="bg-zinc-900 text-white">serving (100g)</option>
                        <option value="katori" className="bg-zinc-900 text-white">katori (150g)</option>
                        <option value="bowl" className="bg-zinc-900 text-white">bowl (200g)</option>
                        <option value="plate" className="bg-zinc-900 text-white">plate (300g)</option>
                        <option value="grams" className="bg-zinc-900 text-white">grams (1g)</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* Calculated Nutrients Panel */}
              <div className="bg-amber-950/20 p-4 rounded-2xl border border-amber-900/40 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-zinc-200">
                  <span>Estimated Total Energy</span>
                  <span className="text-base text-amber-400 font-extrabold">
                    {calculatedNutrients ? Math.round(calculatedNutrients.calories) : 0} kcal
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 pt-2 border-t border-amber-900/40 text-center">
                  <div>
                    <span className="text-[10px] text-zinc-400 font-semibold block">Protein</span>
                    <span className="text-xs font-bold text-amber-300">
                      {calculatedNutrients ? calculatedNutrients.protein_g : 0}g
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 font-semibold block">Carbs</span>
                    <span className="text-xs font-bold text-white">
                      {calculatedNutrients ? calculatedNutrients.carbs_g : 0}g
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 font-semibold block">Fat</span>
                    <span className="text-xs font-bold text-yellow-500">
                      {calculatedNutrients ? calculatedNutrients.fat_g : 0}g
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 font-semibold block">Fiber</span>
                    <span className="text-xs font-bold text-emerald-400">
                      {calculatedNutrients ? calculatedNutrients.fiber_g : 0}g
                    </span>
                  </div>
                </div>

                <div className="text-[10px] text-zinc-500 text-center pt-1">
                  Formula: (nutrient_per_100g × {calculatedNutrients?.serving_weight_g || 100}g) ÷ 100
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Optional Notes</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. cooked with minimal oil, home recipe"
                  className="w-full p-2.5 rounded-xl bg-black/60 border border-zinc-800 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all text-white placeholder:text-zinc-600"
                />
              </div>
            </div>

            <button
              onClick={handleManualSave}
              disabled={isSaving || (!selectedFood && !searchQuery.trim())}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-black font-extrabold text-xs shadow-lg shadow-amber-500/20 gold-box-glow transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm & Save Entry</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: AI IMAGE SCAN */}
      {activeTab === 'image' && (
        <div className="bg-[#0d0d12] rounded-3xl p-6 sm:p-8 border border-zinc-800/90 shadow-xl space-y-6">
          <div className="max-w-xl mx-auto text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-950/60 border border-amber-800/50 text-amber-400 flex items-center justify-center mx-auto mb-2 shadow-sm">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">AI Food Recognition</h3>
            <p className="text-xs text-zinc-400">
              Upload a clear photo of your meal (rotis, thali, salad, or regional dish).
              SehatSense AI will identify likely dishes and calculate nutrients for your confirmation.
            </p>
          </div>

          {/* Upload Zone */}
          <div className="max-w-md mx-auto">
            <label className="border-2 border-dashed border-zinc-700 hover:border-amber-400 rounded-3xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-black/40 hover:bg-amber-950/15">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Food Preview"
                  className="max-h-56 w-auto rounded-2xl object-cover shadow-sm mb-3"
                />
              ) : (
                <Upload className="w-10 h-10 text-zinc-500 mb-2" />
              )}
              <span className="text-xs font-semibold text-zinc-300">
                {selectedFile ? selectedFile.name : 'Click to select or drop food photo'}
              </span>
              <span className="text-[10px] text-zinc-500 mt-0.5">JPG, PNG, or WebP up to 5MB</span>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>

            {selectedFile && (
              <button
                onClick={handleScanImage}
                disabled={isUploading}
                className="w-full mt-4 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-black font-extrabold text-xs shadow-lg shadow-amber-500/20 gold-box-glow transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    <span>Analyzing Image with SehatSense AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Identify Dishes with SehatSense AI</span>
                  </>
                )}
              </button>
            )}

            {imageError && (
              <div className="mt-4 p-4 rounded-2xl bg-red-950/40 border border-red-800/60 text-xs text-red-300 space-y-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                  <span>{imageError}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('manual')}
                  className="w-full py-2 bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-amber-500/20"
                >
                  <Search className="w-3.5 h-3.5" />
                  Switch to Manual Food Search
                </button>
              </div>
            )}

            {scanPerformed && !imageError && detectedItems.length === 0 && !isUploading && (
              <div className="mt-4 p-4 rounded-2xl bg-amber-950/40 border border-amber-800/60 text-xs text-amber-300 space-y-3">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 flex-shrink-0 text-amber-400 mt-0.5" />
                  <span>
                    {scanMessage ||
                      'No specific food items could be recognized with sufficient certainty. Please use manual food search to log your meal accurately.'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('manual')}
                  className="w-full py-2 bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-amber-500/20"
                >
                  <Search className="w-3.5 h-3.5" />
                  Search and Log Manually Instead
                </button>
              </div>
            )}
          </div>

          {detectedItems.length > 0 && (
            <div className="pt-6 border-t border-zinc-800 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>Detected Food Items ({detectedItems.length})</span>
                </h4>
                <span className="text-xs text-zinc-400">Review & confirm to log each item</span>
              </div>

              {imageDisclaimer && (
                <div className="p-3 bg-amber-950/30 border border-amber-800/50 rounded-xl text-xs text-amber-300 flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>{imageDisclaimer}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {detectedItems.map((item, idx) => {
                  const nut = item.estimated_nutrients || {};
                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-black/60 border border-zinc-800 flex flex-col justify-between space-y-3 hover:border-amber-500/40 transition-all"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <h5 className="text-sm font-bold text-white">{item.detected_name}</h5>
                          <span className="text-[10px] font-semibold bg-amber-950/70 text-amber-300 border border-amber-800/50 px-2 py-0.5 rounded-full capitalize">
                            {item.confidence} confidence
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400">Portion: {item.estimated_portion}</p>
                        {item.note && <p className="text-[11px] text-zinc-500 mt-1 italic">{item.note}</p>}

                        <div className="mt-2 text-xs font-semibold text-zinc-300 flex gap-3">
                          <span>{nut.calories ? `${Math.round(nut.calories)} kcal` : '~150 kcal'}</span>
                          <span className="text-amber-400 font-bold">{nut.protein_g ? `${nut.protein_g}g Protein` : '~5g Protein'}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleSaveDetectedItem(item)}
                        className="py-2 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <PlusCircle className="w-3.5 h-3.5" /> Add to Food Diary
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      <MedicalDisclaimer />
    </div>
  );
};
