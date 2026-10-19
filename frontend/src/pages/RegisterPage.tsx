import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { FlowingParticles } from '../components/FlowingParticles';
import {
  Lock,
  Mail,
  User,
  ArrowRight,
  AlertCircle,
  ShieldCheck,
  Eye,
  EyeOff,
  CheckCircle2,
  Heart,
} from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [consent, setConsent] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!consent) {
      setError('Please agree to health data processing consent to continue.');
      return;
    }

    setIsLoading(true);
    try {
      const data = await api.register({
        email,
        password,
        display_name: displayName || 'Health Seeker',
      });
      await login(data.access_token, data.user);
      navigate('/onboarding');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try a different email.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-gradient-to-br from-[#1c1408] via-[#0f0b04] to-[#060402] rounded-3xl border border-amber-500/40 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left: Onyx & Golden Amber Branding Panel */}
        <div className="lg:col-span-5 bg-gradient-to-b from-[#180f03]/95 via-[#0e0902]/98 to-[#050301] p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-amber-500/30">
          {/* Custom Background Image Texture */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-screen pointer-events-none"
            style={{ backgroundImage: `url('/images/sehatsense-background.png')` }}
          />

          {/* Animated Flowing Particles */}
          <FlowingParticles count={35} connectLines={true} />

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
                  <span className="text-xs font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full">
                    AI
                  </span>
                </div>
                <p className="text-xs text-amber-300 font-semibold">Smart Food Choices, Better Health.</p>
              </div>
            </div>

            <div className="space-y-4 my-8">
              <h2 className="text-2xl font-bold leading-tight tracking-tight text-white">
                Start Your Intelligent Nutrition Journey
              </h2>
              <p className="text-sm text-zinc-300 leading-relaxed">
                Join thousands who balance authentic Indian dishes with smart macro goals, hydration tracking, and symptom awareness.
              </p>
            </div>

            {/* Highlights */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2.5 text-sm font-medium text-zinc-200">
                <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <span>Personalized Mifflin-St Jeor TDEE target</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm font-medium text-zinc-200">
                <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <span>Bilingual conversational assistance in Hindi & English</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm font-medium text-zinc-200">
                <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <span>Smart budget-friendly meal plan generation</span>
              </div>
            </div>
          </div>

          {/* Bottom Trust Badge */}
          <div className="relative z-10 pt-6 mt-6 border-t border-zinc-800/80">
            <div className="flex items-center gap-2 text-xs text-zinc-300 font-medium">
              <ShieldCheck className="w-4.5 h-4.5 text-amber-400" />
              <span>Zero health-data selling. Total user consent controls.</span>
            </div>
          </div>
        </div>

        {/* Right: Registration Form */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center bg-gradient-to-br from-[#120d05]/95 via-[#0c0904]/98 to-[#060402]">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-white tracking-tight">Create Your Account</h3>
            <p className="text-xs text-zinc-400 mt-1">
              Begin tracking your meals, hydration, and habits with SehatSense AI.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-950/40 border border-red-800/60 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Vikash Mishra"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/60 border border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all text-white placeholder:text-zinc-600"
                />
              </div>
            </div>

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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Create Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 chars"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-black/60 border border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all text-white placeholder:text-zinc-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/60 border border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all text-white placeholder:text-zinc-600"
                  />
                </div>
              </div>
            </div>

            {/* Privacy Consent Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 w-4.5 h-4.5 text-amber-500 bg-black/60 rounded border-zinc-700 focus:ring-amber-400"
                />
                <span className="text-xs text-zinc-300 leading-relaxed font-medium">
                  I agree to the secure storage of my food diary and lifestyle logs for educational wellness intelligence,
                  and acknowledge SehatSense AI is not medical treatment.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-3 py-3 px-4 rounded-xl font-black text-sm text-black bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 shadow-lg shadow-amber-500/20 gold-box-glow transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-zinc-300 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-amber-400 hover:text-amber-300 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
