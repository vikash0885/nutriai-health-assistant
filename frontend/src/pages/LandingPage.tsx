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
    <div className="min-h-screen bg-[#070709] text-zinc-100 flex flex-col">
      {/* Hero Section: Dark Onyx Grid + Radiant Gold Accents */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28 mx-2 sm:mx-4 mt-2 rounded-3xl border border-zinc-800/80 bg-[#050507] bg-grid-mesh shadow-2xl">
        {/* Warm Golden/Amber Ambient Glow in center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-gradient-to-tr from-amber-500/20 via-yellow-500/15 to-transparent rounded-full blur-[110px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Center Logo Artwork */}
            <div className="flex justify-center mb-6">
              <img
                src="/images/sehatsense-logo-icon.png"
                alt="SehatSense AI"
                className="h-20 sm:h-24 w-auto object-contain drop-shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-transform duration-500 hover:scale-105"
              />
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

            {/* Developer Credit */}
            <div className="mt-8 flex justify-center">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/60 text-xs text-zinc-400">
                <span>Made with ❤️ by <strong className="text-amber-300 font-semibold">Vikash Mishra</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-20 bg-[#070709] border-t border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-3 tracking-tight">
              Comprehensive Health Intelligence, Built for Real Life
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              No generic western meal plans that ignore your culture. SehatSense AI embraces authentic Indian staples,
              honest calculations, and safe digestive pattern recognition.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Card 1 */}
            <div className="p-6 rounded-3xl bg-[#0c0c10] border border-zinc-800/80 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/10 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">AI Vision Photo Logging</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Snap a picture of your thali or snack. SehatSense AI detects your rotis, dals, and sabzis,
                allowing you to confirm portions while our deterministic engine calculates precise nutrients.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-3xl bg-[#0c0c10] border border-zinc-800/80 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/10 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Food-to-Symptom Pattern Mining</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Log bloating, acidity, or sluggishness. Our deterministic algorithm computes time lags and
                flags repeated associations with medical disclaimers to help you have informed doctor visits.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-3xl bg-[#0c0c10] border border-zinc-800/80 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/10 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Bilingual Hindi-English AI Assistant</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Ask questions in English, Hindi, or Hinglish: <span className="italic text-amber-300">"Aaj maine kitna protein khaya?"</span>.
                The assistant reads your live diary records with zero hallucinated history.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-6 rounded-3xl bg-[#0c0c10] border border-zinc-800/80 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/10 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Smart Affordable Meal Planner</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Generate practical daily plans tailored to your budget (e.g. ₹250/day), allergies, and dietary choices
                (Veg, Eggetarian, Non-Veg). 1-click adds meals to diary and builds grocery lists!
              </p>
            </div>

            {/* Card 5 */}
            <div className="p-6 rounded-3xl bg-[#0c0c10] border border-zinc-800/80 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/10 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Apple className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Eat This, Try This</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Instead of shaming traditional foods, discover budget-friendly upgrades: adding sprouted moong to
                boost fiber, or swapping packaged biscuits for roasted chana and chaas.
              </p>
            </div>

            {/* Card 6 */}
            <div className="p-6 rounded-3xl bg-[#0c0c10] border border-zinc-800/80 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/10 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Dumbbell className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Exercise & Post-Meal Strolls</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
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
