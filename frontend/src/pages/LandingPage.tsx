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
  Star,
  Clock,
  Users,
} from 'lucide-react';
import { api } from '../services/api';
import { FlowingParticles } from '../components/FlowingParticles';

export const LandingPage: React.FC = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  const handleDemoLogin = async () => {
    try {
      let tokenData;
      try {
        tokenData = await api.login({
          email: 'ssdemo@gmail.com',
          password: 'DemoPassword123!',
        });
      } catch {
        tokenData = await api.register({
          email: 'ssdemo@gmail.com',
          password: 'DemoPassword123!',
          display_name: 'Vikash Mishra',
        });
      }

      localStorage.setItem('nutriai_token', tokenData.access_token);
      await api.updateProfile({
        display_name: 'Vikash Mishra',
        age: 26,
        gender: 'male',
        height_cm: 175,
        weight_kg: 70,
        activity_level: 'moderate',
        dietary_preference: 'vegetarian',
        fitness_goal: 'general_wellness',
        daily_budget_inr: 250,
        preferred_language: 'en',
        onboarding_completed: true,
      });

      await login(tokenData.access_token, tokenData.user);
      navigate('/dashboard');
    } catch (err: any) {
      alert(`Could not sign in to demo account: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-zinc-100 flex flex-col">
      {/* Hero Section: Full width Dark Onyx + Radiant Gold Accents */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28 w-full border-b border-zinc-800/80 bg-transparent">
        {/* Warm Golden/Amber Ambient Glow in center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[360px] bg-gradient-to-tr from-amber-500/12 via-yellow-500/8 to-transparent rounded-full blur-[90px] pointer-events-none" />

        <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Center Brand Wordmark */}
            <div className="flex items-center justify-center mb-6">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight drop-shadow-[0_0_35px_rgba(245,158,11,0.45)]">
                <span className="text-white">Sehat</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">Sense</span>
                <span className="text-amber-300 text-xl sm:text-2xl ml-2.5 font-extrabold bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 rounded-xl align-middle shadow-[0_0_15px_rgba(245,158,11,0.25)]">
                  AI
                </span>
              </h2>
            </div>

            {/* Top Badge: Golden pill matching reference image */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-amber-500/40 bg-black/60 shadow-lg mb-8 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_10px_#f59e0b] animate-pulse" />
              <span className="text-xs font-semibold text-amber-300 tracking-wider uppercase">
                Welcome to SehatSense AI — THE ERA OF INTELLIGENT HEALTH
              </span>
            </div>

            {/* Massive Heading matching reference image */}
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[1.06] mb-5">
              Unlock Your Path to <br />
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 gold-glow">
                better health.
              </span>
            </h1>

            {/* Body Description */}
            <p className="text-base sm:text-lg text-zinc-300 mb-8 leading-relaxed max-w-2xl mx-auto font-normal">
              India’s leading personalised food and nutrition intelligence platform — a purpose-built assistant that transforms daily food habits into vibrant wellness through deterministic portion math, symptom pattern detection, and bilingual AI guidance.
            </p>

            {/* Stat Badges Row matching reference image */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-800 bg-black/60 text-xs text-zinc-200 backdrop-blur-md shadow-xs">
                <Users className="w-4 h-4 text-amber-400" />
                <span><strong className="text-white font-bold">120+</strong> Curated Indian Dishes</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-800 bg-black/60 text-xs text-zinc-200 backdrop-blur-md shadow-xs">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span><strong className="text-white font-bold">100%</strong> Deterministic Nutrition Math</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-800 bg-black/60 text-xs text-zinc-200 backdrop-blur-md shadow-xs">
                <Clock className="w-4 h-4 text-amber-400" />
                <span><strong className="text-white font-bold">24/7</strong> Bilingual AI Guidance</span>
              </div>
            </div>

            {/* CTAs matching glowing reference button style */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-black font-extrabold px-9 py-4 rounded-full shadow-lg shadow-amber-500/30 gold-box-glow transition-all text-sm cursor-pointer"
                >
                  <span>Go to Your Dashboard</span>
                  <ArrowRight className="w-4 h-4 text-black stroke-[2.5]" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-black font-extrabold px-9 py-4 rounded-full shadow-lg shadow-amber-500/30 gold-box-glow transition-all text-sm cursor-pointer"
                  >
                    <span>Start your Journey</span>
                    <ArrowRight className="w-4 h-4 text-black stroke-[2.5]" />
                  </Link>

                  <button
                    onClick={handleDemoLogin}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 font-bold px-8 py-4 rounded-full border border-amber-500/40 transition-all text-sm cursor-pointer backdrop-blur-sm"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Try Instant Demo</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-20 bg-transparent border-t border-zinc-800/80 w-full">
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
              Comprehensive Health Intelligence, Built for Real Life
            </h2>
            <p className="text-zinc-300 text-base sm:text-lg leading-relaxed">
              No generic western meal plans that ignore your culture. SehatSense AI embraces authentic Indian staples,
              honest calculations, and safe digestive pattern recognition.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {/* Card 1: Warm Golden Amber */}
            <div className="p-7 sm:p-9 rounded-3xl bg-gradient-to-br from-[#281805]/85 via-[#1a1106]/90 to-[#0c0a07]/95 border border-amber-500/40 hover:border-amber-400 hover:shadow-2xl hover:shadow-amber-500/20 transition-all group backdrop-blur-xs">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform shadow-lg shadow-amber-500/10">
                <Camera className="w-7 h-7" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-amber-300 mb-3 tracking-tight transition-colors">AI Vision Photo Logging</h3>
              <p className="text-sm sm:text-base text-zinc-200/90 leading-relaxed">
                Snap a picture of your thali or snack. SehatSense AI detects your rotis, dals, and sabzis,
                allowing you to confirm portions while our deterministic engine calculates precise nutrients.
              </p>
            </div>

            {/* Card 2: Deep Ruby / Rose Vitality */}
            <div className="p-7 sm:p-9 rounded-3xl bg-gradient-to-br from-[#2e0814]/85 via-[#1d060e]/90 to-[#0e070a]/95 border border-rose-500/40 hover:border-rose-400 hover:shadow-2xl hover:shadow-rose-500/20 transition-all group backdrop-blur-xs">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform shadow-lg shadow-rose-500/10">
                <Activity className="w-7 h-7" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-rose-300 mb-3 tracking-tight transition-colors">Food-to-Symptom Pattern Mining</h3>
              <p className="text-sm sm:text-base text-zinc-200/90 leading-relaxed">
                Log bloating, acidity, or sluggishness. Our deterministic algorithm computes time lags and
                flags repeated associations with medical disclaimers to help you have informed doctor visits.
              </p>
            </div>

            {/* Card 3: Deep Royal Violet / Indigo AI */}
            <div className="p-7 sm:p-9 rounded-3xl bg-gradient-to-br from-[#1e0e38]/85 via-[#130924]/90 to-[#0a0712]/95 border border-violet-500/40 hover:border-violet-400 hover:shadow-2xl hover:shadow-violet-500/20 transition-all group backdrop-blur-xs">
              <div className="w-14 h-14 rounded-2xl bg-violet-500/20 border border-violet-500/40 text-violet-300 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform shadow-lg shadow-violet-500/10">
                <Bot className="w-7 h-7" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-violet-300 mb-3 tracking-tight transition-colors">Bilingual Hindi-English AI Assistant</h3>
              <p className="text-sm sm:text-base text-zinc-200/90 leading-relaxed">
                Ask questions in English, Hindi, or Hinglish: <span className="italic text-violet-300 font-medium">"Aaj maine kitna protein khaya?"</span>.
                The assistant reads your live diary records with zero hallucinated history.
              </p>
            </div>

            {/* Card 4: Lush Emerald Green Budget */}
            <div className="p-7 sm:p-9 rounded-3xl bg-gradient-to-br from-[#072a17]/85 via-[#051a0f]/90 to-[#040e08]/95 border border-emerald-500/40 hover:border-emerald-400 hover:shadow-2xl hover:shadow-emerald-500/20 transition-all group backdrop-blur-xs">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform shadow-lg shadow-emerald-500/10">
                <Calendar className="w-7 h-7" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-emerald-300 mb-3 tracking-tight transition-colors">Smart Affordable Meal Planner</h3>
              <p className="text-sm sm:text-base text-zinc-200/90 leading-relaxed">
                Generate practical daily plans tailored to your budget (e.g. ₹250/day), allergies, and dietary choices
                (Veg, Eggetarian, Non-Veg). 1-click adds meals to diary and builds grocery lists!
              </p>
            </div>

            {/* Card 5: Cool Ocean Cyan / Teal Freshness */}
            <div className="p-7 sm:p-9 rounded-3xl bg-gradient-to-br from-[#062630]/85 via-[#041920]/90 to-[#040e12]/95 border border-cyan-500/40 hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all group backdrop-blur-xs">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform shadow-lg shadow-cyan-500/10">
                <Apple className="w-7 h-7" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-cyan-300 mb-3 tracking-tight transition-colors">Eat This, Try This</h3>
              <p className="text-sm sm:text-base text-zinc-200/90 leading-relaxed">
                Instead of shaming traditional foods, discover budget-friendly upgrades: adding sprouted moong to
                boost fiber, or swapping packaged biscuits for roasted chana and chaas.
              </p>
            </div>

            {/* Card 6: Warm Sunset Orange / Coral Fitness */}
            <div className="p-7 sm:p-9 rounded-3xl bg-gradient-to-br from-[#2f1406]/85 via-[#1e0e05]/90 to-[#0e0704]/95 border border-orange-500/40 hover:border-orange-400 hover:shadow-2xl hover:shadow-orange-500/20 transition-all group backdrop-blur-xs">
              <div className="w-14 h-14 rounded-2xl bg-orange-500/20 border border-orange-500/40 text-orange-300 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform shadow-lg shadow-orange-500/10">
                <Dumbbell className="w-7 h-7" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-orange-300 mb-3 tracking-tight transition-colors">Exercise & Post-Meal Strolls</h3>
              <p className="text-sm sm:text-base text-zinc-200/90 leading-relaxed">
                Traditional gentle 100-step strolls (Shatapawali) after meals accelerate gastric emptying and steady
                blood sugar, complemented by beginner workout routines and water tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Notice Section */}
      <section className="py-14 bg-[#050507] border-t border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Our Medical Safety & Educational Pledge</h3>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            SehatSense AI is designed as an empowering wellness education tool. We believe in transparency:
            our AI models never claim to diagnose diseases or promise cure-all diets.
            All calculated numbers are clearly labeled estimates, and user privacy remains strictly protected.
          </p>
        </div>
      </section>
    </div>
  );
};
