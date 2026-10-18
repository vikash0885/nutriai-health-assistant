import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Apple,
  Dumbbell,
  ShieldAlert,
} from 'lucide-react';

export const OnboardingPage: React.FC = () => {
  const { profile, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [age, setAge] = useState<number | ''>(profile?.age || 26);
  const [gender, setGender] = useState(profile?.gender || 'prefer_not_to_say');
  const [heightCm, setHeightCm] = useState<number | ''>(profile?.height_cm || 170);
  const [weightKg, setWeightKg] = useState<number | ''>(profile?.weight_kg || 65);

  const [activityLevel, setActivityLevel] = useState(profile?.activity_level || 'moderate');
  const [dietaryPreference, setDietaryPreference] = useState(profile?.dietary_preference || 'vegetarian');
  const [fitnessGoal, setFitnessGoal] = useState(profile?.fitness_goal || 'general_wellness');
  const [dailyBudget, setDailyBudget] = useState<number | ''>(profile?.daily_budget_inr || 250);
  const [language, setLanguage] = useState(profile?.preferred_language || 'en');

  const [allergies, setAllergies] = useState<string[]>(profile?.allergies || []);
  const [restrictions, setRestrictions] = useState<string[]>(profile?.restrictions || []);
  const [healthNotes, setHealthNotes] = useState(profile?.health_considerations || '');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const allergyOptions = [
    'Peanuts',
    'Tree Nuts (Almonds/Walnuts)',
    'Dairy / Lactose',
    'Gluten / Wheat',
    'Soy',
    'Eggs',
    'Fish / Shellfish',
    'Mustard',
    'Sesame',
  ];

  const restrictionOptions = [
    'No Onion & Garlic (Jain style)',
    'Low Sodium',
    'Low Oil / Less Fried',
    'Sugar Sensitive',
    'Halal',
  ];

  const toggleAllergy = (item: string) => {
    setAllergies((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const toggleRestriction = (item: string) => {
    setRestrictions((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleFinish = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await api.updateProfile({
        display_name: displayName || 'Health Seeker',
        age: age ? Number(age) : null,
        gender,
        height_cm: heightCm ? Number(heightCm) : null,
        weight_kg: weightKg ? Number(weightKg) : null,
        activity_level: activityLevel,
        dietary_preference: dietaryPreference,
        fitness_goal: fitnessGoal,
        allergies,
        restrictions,
        daily_budget_inr: dailyBudget ? Number(dailyBudget) : 250,
        preferred_language: language,
        health_considerations: healthNotes || null,
        onboarding_completed: true,
      });

      await refreshProfile();
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to save onboarding data. Please check fields.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="max-w-xl w-full bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
            <span>Step {step} of 3</span>
            <span>
              {step === 1 && 'Biometrics & Body'}
              {step === 2 && 'Dietary Culture & Goals'}
              {step === 3 && 'Allergies & Wellness'}
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-violet-600 h-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
            {error}
          </div>
        )}

        {/* STEP 1: Biometrics */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Tell us a bit about yourself</h3>
              <p className="text-xs text-slate-500 mt-1">
                Used to calculate your daily basal metabolic rate and safe calorie & protein targets.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your Name"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Age</label>
                <input
                  type="number"
                  min={12}
                  max={110}
                  value={age}
                  onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-white"
                >
                  <option value="prefer_not_to_say">Prefer not to say</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Height (cm)</label>
                <input
                  type="number"
                  min={100}
                  max={240}
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value ? Number(e.target.value) : '')}
                  placeholder="e.g. 170"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  min={30}
                  max={250}
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value ? Number(e.target.value) : '')}
                  placeholder="e.g. 65"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Physical Activity Level</label>
              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-white"
              >
                <option value="sedentary">Sedentary (Little or no exercise, desk job)</option>
                <option value="light">Lightly Active (Light exercise / walking 1-3 days/week)</option>
                <option value="moderate">Moderately Active (Moderate exercise 3-5 days/week)</option>
                <option value="active">Active (Heavy exercise / sports 6-7 days/week)</option>
                <option value="very_active">Very Active (Physical job or twice-a-day training)</option>
              </select>
            </div>
          </div>
        )}

        {/* STEP 2: Dietary Preferences & Goal */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Food Culture & Goals</h3>
              <p className="text-xs text-slate-500 mt-1">
                Customize your meal recommendations, budgets, and nutritional goals.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Dietary Preference</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'vegetarian', label: 'Vegetarian' },
                  { id: 'eggetarian', label: 'Eggetarian' },
                  { id: 'vegan', label: 'Vegan' },
                  { id: 'non_vegetarian', label: 'Non-Vegetarian' },
                  { id: 'jain', label: 'Jain Vegetarian' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setDietaryPreference(item.id)}
                    className={`p-3 rounded-xl border text-xs font-medium text-center transition-all ${
                      dietaryPreference === item.id
                        ? 'border-violet-600 bg-violet-50 text-violet-800 font-bold ring-1 ring-violet-600'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Primary Fitness Goal</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { id: 'general_wellness', label: 'General Wellness & Energy' },
                  { id: 'weight_maintenance', label: 'Weight Maintenance' },
                  { id: 'weight_loss', label: 'Healthy Weight Management' },
                  { id: 'muscle_building', label: 'Muscle Building & Strength' },
                  { id: 'improve_activity', label: 'Improving Physical Fitness' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFitnessGoal(item.id)}
                    className={`p-3 rounded-xl border text-xs font-medium text-left transition-all ${
                      fitnessGoal === item.id
                        ? 'border-violet-600 bg-violet-50 text-violet-800 font-bold ring-1 ring-violet-600'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Daily Food Budget (₹ INR)
                </label>
                <input
                  type="number"
                  min={50}
                  max={2000}
                  value={dailyBudget}
                  onChange={(e) => setDailyBudget(e.target.value ? Number(e.target.value) : '')}
                  placeholder="e.g. 250"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-white"
                >
                  <option value="en">English</option>
                  <option value="hi">हिन्दी (Hindi)</option>
                  <option value="hinglish">Hinglish</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Allergies & Health Notes */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Allergies & Sensitivities</h3>
              <p className="text-xs text-slate-500 mt-1">
                NutriAi-VM's meal planner will NEVER suggest items conflicting with your marked allergies.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Known Food Allergies</label>
              <div className="flex flex-wrap gap-2">
                {allergyOptions.map((item) => {
                  const active = allergies.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleAllergy(item)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        active
                          ? 'border-rose-500 bg-rose-50 text-rose-700 font-bold'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {active ? `✓ ${item}` : item}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Dietary Restrictions</label>
              <div className="flex flex-wrap gap-2">
                {restrictionOptions.map((item) => {
                  const active = restrictions.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleRestriction(item)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        active
                          ? 'border-violet-600 bg-violet-50 text-violet-800 font-bold'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {active ? `✓ ${item}` : item}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Optional Health Considerations (Confidential)
              </label>
              <textarea
                rows={3}
                value={healthNotes}
                onChange={(e) => setHealthNotes(e.target.value)}
                placeholder="e.g. Mild acid reflux after oily food, preparing for a marathon, fluid restriction, etc."
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
              />
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 px-6 py-2.5 rounded-xl shadow-md shadow-violet-600/20 transition-all"
            >
              Next Step <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isLoading}
              onClick={handleFinish}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 px-6 py-2.5 rounded-xl shadow-md shadow-violet-600/20 transition-all disabled:opacity-60"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Complete Setup</span>
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
