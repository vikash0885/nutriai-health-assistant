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
  Droplet,
} from 'lucide-react';
import { api } from '../services/api';

export const LandingPage: React.FC = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  const handleDemoLogin = async () => {
    try {
      // Login with demo account or register if not existing
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
        // Complete onboarding for demo account
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
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/60 to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 bg-emerald-100/80 border border-emerald-200 text-emerald-800 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-6 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>AI-Powered Nutrition & Verified Science</span>
            </div>

            {/* Title & Tagline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-6">
              Eat Smart, <span className="text-emerald-600">Live Healthy</span>.
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 mb-8 leading-relaxed">
              NutriAI is your intelligent food, nutrition, symptom, and lifestyle companion.
              Understand your Indian & global meals, discover digestive patterns, plan affordable diets,
              and chat with your bilingual AI health assistant.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3.5 rounded-2xl shadow-lg shadow-emerald-600/20 transition-all text-sm"
                >
                  Go to Your Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3.5 rounded-2xl shadow-lg shadow-emerald-600/20 transition-all text-sm"
                  >
                    Start Free Journey
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={handleDemoLogin}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-6 py-3.5 rounded-2xl border border-slate-300 shadow-sm transition-all text-sm"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    Try Instant Demo
                  </button>
                </>
              )}
            </div>

            {/* Feature Pills */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 120+ Curated Indian Dishes
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> AI Vision Image Scan
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Symptom Pattern Analyzer
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Hindi & English Assistant
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
              Comprehensive Health Intelligence, Built for Real Life
            </h2>
            <p className="text-slate-600 text-sm">
              No generic western meal plans that ignore your culture. NutriAI embraces authentic Indian staples,
              honest calculations, and safe digestive pattern recognition.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">AI Vision Photo Logging</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Snap a picture of your thali or snack. NutriAI detects your rotis, dals, and sabzis,
                allowing you to confirm portions while our deterministic engine calculates precise nutrients.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Food-to-Symptom Pattern Mining</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Log bloating, acidity, or sluggishness. Our deterministic algorithm computes time lags and
                flags repeated associations with medical disclaimers to help you have informed doctor visits.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-4">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Bilingual Hindi-English AI Assistant</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Ask questions in English, Hindi, or Hinglish: <span className="italic text-slate-700">"Aaj maine kitna protein khaya?"</span>.
                The assistant reads your live diary records with zero hallucinated history.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Smart Affordable Meal Planner</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Generate practical daily plans tailored to your budget (e.g. ₹250/day), allergies, and dietary choices
                (Veg, Eggetarian, Non-Veg). 1-click adds meals to diary and builds grocery lists!
              </p>
            </div>

            {/* Card 5 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mb-4">
                <Apple className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Eat This, Try This</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Instead of shaming traditional foods, discover budget-friendly upgrades: adding sprouted moong to
                boost fiber, or swapping packaged biscuits for roasted chana and chaas.
              </p>
            </div>

            {/* Card 6 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-4">
                <Dumbbell className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Exercise & Post-Meal Strolls</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Traditional gentle 100-step strolls (Shatapawali) after meals accelerate gastric emptying and steady
                blood sugar, complemented by beginner workout routines and water tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Notice Section */}
      <section className="py-12 bg-slate-100/60 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex p-3 rounded-2xl bg-emerald-100 text-emerald-800 mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Our Medical Safety & Educational Pledge</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            NutriAI is designed as an empowering wellness education tool. We believe in transparency:
            our AI models never claim to diagnose diseases or promise cure-all diets.
            All calculated numbers are clearly labeled estimates, and user privacy remains strictly protected.
          </p>
        </div>
      </section>
    </div>
  );
};
