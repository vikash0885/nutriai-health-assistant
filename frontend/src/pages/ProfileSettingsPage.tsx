import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { UserProfile, ConsentRecord } from '../types';
import { MedicalDisclaimer } from '../components/MedicalDisclaimer';
import {
  User,
  Shield,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Save,
  Sparkles,
  Lock,
} from 'lucide-react';

export const ProfileSettingsPage: React.FC = () => {
  const { profile, refreshProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [age, setAge] = useState<number | ''>(profile?.age || '');
  const [gender, setGender] = useState(profile?.gender || 'prefer_not_to_say');
  const [heightCm, setHeightCm] = useState<number | ''>(profile?.height_cm || '');
  const [weightKg, setWeightKg] = useState<number | ''>(profile?.weight_kg || '');
  const [activityLevel, setActivityLevel] = useState(profile?.activity_level || 'moderate');
  const [dietaryPreference, setDietaryPreference] = useState(profile?.dietary_preference || 'vegetarian');
  const [fitnessGoal, setFitnessGoal] = useState(profile?.fitness_goal || 'general_wellness');
  const [dailyBudget, setDailyBudget] = useState<number | ''>(profile?.daily_budget_inr || 250);
  const [language, setLanguage] = useState(profile?.preferred_language || 'en');

  // Consent
  const [healthConsent, setHealthConsent] = useState(true);
  const [aiConsent, setAiConsent] = useState(true);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name);
      setAge(profile.age || '');
      setGender(profile.gender || 'prefer_not_to_say');
      setHeightCm(profile.height_cm || '');
      setWeightKg(profile.weight_kg || '');
      setActivityLevel(profile.activity_level);
      setDietaryPreference(profile.dietary_preference);
      setFitnessGoal(profile.fitness_goal);
      setDailyBudget(profile.daily_budget_inr || 250);
      setLanguage(profile.preferred_language);
    }

    api.getConsent().then((c) => {
      setHealthConsent(c.health_data_consent);
      setAiConsent(c.ai_processing_consent);
    }).catch(console.error);
  }, [profile]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(null);
    try {
      await api.updateProfile({
        display_name: displayName,
        age: age ? Number(age) : null,
        gender,
        height_cm: heightCm ? Number(heightCm) : null,
        weight_kg: weightKg ? Number(weightKg) : null,
        activity_level: activityLevel,
        dietary_preference: dietaryPreference,
        fitness_goal: fitnessGoal,
        daily_budget_inr: dailyBudget ? Number(dailyBudget) : 250,
        preferred_language: language,
      });

      await api.updateConsent({
        health_data_consent: healthConsent,
        ai_processing_consent: aiConsent,
      });

      await refreshProfile();
      setSaveSuccess('Profile and targets updated successfully!');
    } catch (err: any) {
      alert(`Could not save profile: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmName = prompt(
      'CAUTION: Deleting your account will permanently wipe all your food entries, symptom logs, water history, and personal data. Type DELETE to confirm:'
    );
    if (confirmName === 'DELETE') {
      try {
        await api.deleteAccount();
        logout();
        navigate('/');
      } catch (err: any) {
        alert(`Account deletion failed: ${err.message}`);
      }
    }
  };

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Settings & Privacy</h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Manage your biometric profile, recalculated daily macro requirements, and data consent.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {/* Target Preview Strip */}
      {profile && (
        <div className="bg-[#0d0d12] border border-zinc-800/90 shadow-xl rounded-3xl p-6 text-center">
          <h3 className="text-sm font-black text-amber-300 uppercase tracking-wider mb-3">
            Computed Daily Dietary Targets (Mifflin-St Jeor & ICMR Standards)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
            <div>
              <span className="text-xs text-zinc-400 font-bold block mb-1">Calories</span>
              <span className="text-lg font-black text-white">{Math.round(profile.daily_calorie_target)} kcal</span>
            </div>
            <div>
              <span className="text-xs text-zinc-400 font-bold block mb-1">Protein</span>
              <span className="text-lg font-black text-amber-400">{profile.daily_protein_target} g</span>
            </div>
            <div>
              <span className="text-xs text-zinc-400 font-bold block mb-1">Carbs</span>
              <span className="text-lg font-black text-amber-300">{profile.daily_carb_target} g</span>
            </div>
            <div>
              <span className="text-xs text-zinc-400 font-bold block mb-1">Fat</span>
              <span className="text-lg font-black text-yellow-500">{profile.daily_fat_target} g</span>
            </div>
            <div>
              <span className="text-xs text-zinc-400 font-bold block mb-1">Fiber</span>
              <span className="text-lg font-black text-emerald-400">{profile.daily_fiber_target} g</span>
            </div>
            <div>
              <span className="text-xs text-zinc-400 font-bold block mb-1">Water</span>
              <span className="text-lg font-black text-sky-400">{profile.daily_water_target_ml} ml</span>
            </div>
          </div>
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSaveProfile} className="bg-[#0d0d12] rounded-3xl p-6 sm:p-8 border border-zinc-800/90 shadow-xl space-y-5">
        <h3 className="text-base font-black text-white flex items-center gap-2">
          <User className="w-5 h-5 text-amber-400" />
          <span>Biometric & Lifestyle Profile</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Display Name</label>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-black/60 border border-zinc-800 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-black/60 border border-zinc-800 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 text-white"
            >
              <option value="prefer_not_to_say" className="bg-zinc-900 text-white">Prefer not to say</option>
              <option value="female" className="bg-zinc-900 text-white">Female</option>
              <option value="male" className="bg-zinc-900 text-white">Male</option>
              <option value="other" className="bg-zinc-900 text-white">Other</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Age</label>
            <input
              type="number"
              min={12}
              max={110}
              value={age}
              onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
              className="w-full p-2.5 rounded-xl bg-black/60 border border-zinc-800 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Height (cm)</label>
            <input
              type="number"
              min={100}
              max={240}
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value ? Number(e.target.value) : '')}
              className="w-full p-2.5 rounded-xl bg-black/60 border border-zinc-800 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Weight (kg)</label>
            <input
              type="number"
              min={30}
              max={250}
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value ? Number(e.target.value) : '')}
              className="w-full p-2.5 rounded-xl bg-black/60 border border-zinc-800 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Dietary Preference</label>
            <select
              value={dietaryPreference}
              onChange={(e) => setDietaryPreference(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-black/60 border border-zinc-800 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 text-white"
            >
              <option value="vegetarian" className="bg-zinc-900 text-white">Vegetarian</option>
              <option value="eggetarian" className="bg-zinc-900 text-white">Eggetarian</option>
              <option value="vegan" className="bg-zinc-900 text-white">Vegan</option>
              <option value="non_vegetarian" className="bg-zinc-900 text-white">Non-Vegetarian</option>
              <option value="jain" className="bg-zinc-900 text-white">Jain Vegetarian</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Fitness Goal</label>
            <select
              value={fitnessGoal}
              onChange={(e) => setFitnessGoal(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-black/60 border border-zinc-800 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 text-white"
            >
              <option value="general_wellness" className="bg-zinc-900 text-white">General Wellness & Vitality</option>
              <option value="weight_maintenance" className="bg-zinc-900 text-white">Weight Maintenance</option>
              <option value="weight_loss" className="bg-zinc-900 text-white">Healthy Weight Loss</option>
              <option value="muscle_building" className="bg-zinc-900 text-white">Muscle Building & Lean Mass</option>
              <option value="improve_activity" className="bg-zinc-900 text-white">Improving Physical Activity</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Activity Level</label>
            <select
              value={activityLevel}
              onChange={(e) => setActivityLevel(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-black/60 border border-zinc-800 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 text-white"
            >
              <option value="sedentary" className="bg-zinc-900 text-white">Sedentary (desk job)</option>
              <option value="light" className="bg-zinc-900 text-white">Lightly active (1-3 days walk)</option>
              <option value="moderate" className="bg-zinc-900 text-white">Moderately active (3-5 days workout)</option>
              <option value="active" className="bg-zinc-900 text-white">Active (6-7 days workouts)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Daily Food Budget (₹ INR)</label>
            <input
              type="number"
              value={dailyBudget}
              onChange={(e) => setDailyBudget(e.target.value ? Number(e.target.value) : '')}
              className="w-full p-2.5 rounded-xl bg-black/60 border border-zinc-800 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 text-white"
            />
          </div>
        </div>

        {/* Privacy & Consent Controls */}
        <div className="pt-4 border-t border-zinc-800 space-y-3">
          <h4 className="text-xs font-bold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-400" />
            <span>Health Data Privacy & Consent Controls</span>
          </h4>

          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={healthConsent}
              onChange={(e) => setHealthConsent(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-amber-500 bg-black rounded border-zinc-700 focus:ring-amber-400"
            />
            <span className="text-xs text-zinc-400">
              Consent to encrypted storage of my food diary and self-reported symptoms for personal wellness tracking.
            </span>
          </label>

          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={aiConsent}
              onChange={(e) => setAiConsent(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-amber-500 bg-black rounded border-zinc-700 focus:ring-amber-400"
            />
            <span className="text-xs text-zinc-400">
              Consent to AI-assisted meal planning, food image understanding, and bilingual conversational answers.
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="w-full py-3 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-black font-extrabold rounded-xl text-xs shadow-lg shadow-amber-500/20 gold-box-glow transition-all flex items-center justify-center gap-1.5 disabled:opacity-60 cursor-pointer"
        >
          {isSaving ? 'Updating...' : 'Save Profile & Recalculate Targets'}
        </button>
      </form>

      {/* Danger Zone: Account Deletion */}
      <div className="bg-rose-950/20 rounded-3xl p-6 sm:p-8 border border-rose-900/40 space-y-3">
        <h3 className="text-sm font-bold text-rose-300 flex items-center gap-2">
          <Trash2 className="w-4 h-4 text-rose-400" />
          <span>Danger Zone: Permanent Account Deletion</span>
        </h3>
        <p className="text-xs text-rose-300/80 leading-relaxed">
          In strict compliance with privacy standards, you can permanently delete your SehatSense AI account at any time.
          This will immediately remove your profile, food entries, symptom logs, hydration records, and grocery items.
        </p>
        <button
          onClick={handleDeleteAccount}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm cursor-pointer"
        >
          Delete Account & Health Data
        </button>
      </div>

      <MedicalDisclaimer />
    </div>
  );
};
