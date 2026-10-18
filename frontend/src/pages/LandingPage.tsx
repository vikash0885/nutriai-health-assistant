import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Camera,
  Activity,
  Calendar,
  ShieldCheck,
  Bot,
  ArrowRight,
  CheckCircle2,
  Apple,
  Dumbbell,
} from 'lucide-react';
import { api } from '../services/api';

export const LandingPage: React.FC = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  const handleDemoLogin = async () => {
    try {
      let tokenData;
      try {
        tokenData = await api.login({
          email: 'demo@nutriai.app',
          password: 'DemoPassword123!',
        });
      } catch {
        tokenData = await api.register({
          email: 'demo@nutriai.app',
          password: 'DemoPassword123!',
          display_name: 'Aarav Patel',
        });
        localStorage.setItem('nutriai_token', tokenData.access_token);
        await api.updateProfile({
          display_name: 'Aarav Patel',
          age: 28,
          gender: 'male',
          height_cm: 175,
          weight_kg: 72,
          activity_level: 'moderate',
          dietary_preference: 'vegetarian',
          fitness_goal: 'general_wellness',
          daily_budget_inr: 250,
          preferred_language: 'en',
          onboarding_completed: true,
        });
      }

      await login(tokenData.access_token, tokenData.user);
      navigate('/dashboard');
    } catch (err: any) {
      alert(`Could not sign in to demo account: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Section: Midnight Blue & Violet Ambience */}
      <section className="relative overflow-hidden bg-[#172554] text-white pt-16 pb-24 lg:pt-24 lg:pb-32 rounded-3xl mx-2 sm:mx-4 mt-2">
        {/* Ambient Violet Glow Orbs */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-600/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 bg-violet-900/60 border border-violet-500/40 text-violet-200 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span>AI-Powered Nutrition & Verified Health Science</span>
            </div>

            {/* Title & Tagline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12] mb-6">
              Eat Smart, <span className="text-violet-400">Live Healthy</span>.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 mb-8 leading-relaxed max-w-2xl mx-auto">
              NutriAi-VM is your intelligent companion for food, nutrition, symptoms, and lifestyle.
              Understand Indian & global meals, discover digestive patterns, plan affordable diets,
              and chat with your bilingual AI health assistant.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg shadow-violet-900/40 transition-all text-sm cursor-pointer"
                >
                  Go to Your Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg shadow-violet-900/40 transition-all text-sm cursor-pointer"
                  >
                    Start Free Journey
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={handleDemoLogin}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-bold px-6 py-3.5 rounded-2xl border border-white/20 shadow-sm transition-all text-sm cursor-pointer backdrop-blur-sm"
                  >
                    <Sparkles className="w-4 h-4 text-violet-300" />
                    Try Instant Demo
                  </button>
                </>
              )}
            </div>

            {/* Feature Badges */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-300 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-violet-400" /> 120+ Curated Indian Dishes
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-violet-400" /> AI Vision Photo Scan
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-violet-400" /> Symptom Pattern Analyzer
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-violet-400" /> Hindi & English Assistant
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
              Comprehensive Health Intelligence, Built for Real Life
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              No generic western meal plans that ignore your culture. NutriAi-VM embraces authentic Indian staples,
              honest calculations, and safe digestive pattern recognition.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Card 1 */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 hover:border-violet-300 hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-violet-100 text-violet-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">AI Vision Photo Logging</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Snap a picture of your thali or snack. NutriAi-VM detects your rotis, dals, and sabzis,
                allowing you to confirm portions while our deterministic engine calculates precise nutrients.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 hover:border-violet-300 hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Food-to-Symptom Pattern Mining</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Log bloating, acidity, or sluggishness. Our deterministic algorithm computes time lags and
                flags repeated associations with medical disclaimers to help you have informed doctor visits.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 hover:border-violet-300 hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-[#172554] text-violet-300 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Bilingual Hindi-English AI Assistant</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Ask questions in English, Hindi, or Hinglish: <span className="italic text-slate-700">"Aaj maine kitna protein khaya?"</span>.
                The assistant reads your live diary records with zero hallucinated history.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 hover:border-violet-300 hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-violet-100 text-violet-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Smart Affordable Meal Planner</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Generate practical daily plans tailored to your budget (e.g. ₹250/day), allergies, and dietary choices
                (Veg, Eggetarian, Non-Veg). 1-click adds meals to diary and builds grocery lists!
              </p>
            </div>

            {/* Card 5 */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 hover:border-violet-300 hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Apple className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Eat This, Try This</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Instead of shaming traditional foods, discover budget-friendly upgrades: adding sprouted moong to
                boost fiber, or swapping packaged biscuits for roasted chana and chaas.
              </p>
            </div>

            {/* Card 6 */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 hover:border-violet-300 hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Dumbbell className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Exercise & Post-Meal Strolls</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Traditional gentle 100-step strolls (Shatapawali) after meals accelerate gastric emptying and steady
                blood sugar, complemented by beginner workout routines and water tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Notice Section */}
      <section className="py-14 bg-slate-100/70 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex p-3 rounded-2xl bg-violet-100 text-violet-800 mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-[#172554] mb-2 tracking-tight">Our Medical Safety & Educational Pledge</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            NutriAi-VM is designed as an empowering wellness education tool. We believe in transparency:
            our AI models never claim to diagnose diseases or promise cure-all diets.
            All calculated numbers are clearly labeled estimates, and user privacy remains strictly protected.
          </p>
        </div>
      </section>
    </div>
  );
};
