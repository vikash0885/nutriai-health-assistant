import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Sparkles,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldCheck,
  HeartPulse,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [forgotNotice, setForgotNotice] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const data = await api.login({ email, password });
      await login(data.access_token, data.user);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoAccount = () => {
    setEmail('demo@nutriai.app');
    setPassword('DemoPassword123!');
    setError(null);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-[#0d0d12] rounded-3xl border border-zinc-800/90 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left: Onyx & Golden Amber Branding Panel */}
        <div className="lg:col-span-5 bg-[#070709] p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-zinc-800/80">
          {/* Custom Background Image Texture */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-screen pointer-events-none"
            style={{ backgroundImage: `url('/images/sehatsense-background.png')` }}
          />

          {/* Grid Mesh */}
          <div className="absolute inset-0 bg-grid-mesh opacity-30 pointer-events-none" />

          {/* Subtle Ambient Gold Glow */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand Identity */}
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <img
                src="/images/sehatsense-logo-icon.png"
                alt="SehatSense AI Logo"
                className="h-12 w-auto object-contain drop-shadow-[0_0_16px_rgba(245,158,11,0.45)]"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl tracking-tight">
                    <span className="text-white">Sehat</span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 drop-shadow-[0_0_12px_rgba(245,158,11,0.3)]">Sense</span>
                  </span>
                  <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
                    AI
                  </span>
                </div>
                <p className="text-xs text-amber-400/90 font-medium">Smart Food Choices, Better Health.</p>
              </div>
            </div>

            <div className="space-y-4 my-8">
              <h2 className="text-2xl font-bold leading-tight tracking-tight text-white">
                Personal Food, Health & Fitness Intelligence
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Log authentic meals, discover pattern correlations, and achieve balanced wellness with bilingual AI assistance.
              </p>
            </div>

            {/* Highlights */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>120+ Curated Indian Dishes & Nutrition Math</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Multimodal AI Food Photo Recognition</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Temporal Symptom Pattern Analysis</span>
              </div>
            </div>
          </div>

          {/* Bottom Trust Badge & Developer Credit */}
          <div className="relative z-10 pt-6 mt-6 border-t border-zinc-800/80 space-y-2">
            <div className="flex items-center gap-2 text-[11px] text-zinc-400">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Private, secure, and user-consented health data</span>
            </div>
            <p className="text-[11px] text-zinc-400 font-medium pt-1">
              Made with ❤️ by <span className="text-amber-300 font-semibold">Vikash Mishra</span>
            </p>
          </div>
        </div>

        {/* Right: Authentication Form */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center bg-[#0d0d12]">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h3>
            <p className="text-xs text-zinc-400 mt-1">
              Sign in to your SehatSense AI account to continue your wellness journey.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-950/40 border border-red-800/60 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {forgotNotice && (
            <div className="mb-5 p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/60 text-xs text-amber-300 flex items-start gap-2">
              <HeartPulse className="w-4 h-4 flex-shrink-0 text-amber-400 mt-0.5" />
              <div>
                <p className="font-semibold">Reset Password</p>
                <p className="text-[11px] text-zinc-300 mt-0.5">
                  For security, local development accounts can reset by creating a new account or using Demo Credentials below.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/60 border border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all text-white placeholder:text-zinc-600"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-zinc-300">Password</label>
                <button
                  type="button"
                  onClick={() => setForgotNotice(!forgotNotice)}
                  className="text-[11px] font-medium text-amber-400 hover:text-amber-300 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-black/60 border border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all text-white placeholder:text-zinc-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-amber-500 bg-black/60 rounded border-zinc-700 focus:ring-amber-400"
                />
                <span className="text-xs text-zinc-400 select-none">Remember this device</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-sm text-black bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 shadow-lg shadow-amber-500/20 gold-box-glow transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo Fast Sign-in */}
          <div className="mt-6 pt-5 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-zinc-500">Want to test right away?</span>
            <button
              type="button"
              onClick={fillDemoAccount}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-3.5 py-2 rounded-xl transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Fill Demo Credentials
            </button>
          </div>

          <p className="text-center text-xs text-zinc-400 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-amber-400 hover:text-amber-300 hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
