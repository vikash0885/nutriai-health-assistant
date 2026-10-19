import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  PlusCircle,
  Camera,
  Bot,
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const { user, profile, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#070709]/95 backdrop-blur-md border-b border-zinc-800/80 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Mobile Toggle & Logo */}
        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-3 group">
            <img
              src="/images/sehatsense-logo-icon.png"
              alt="SehatSense AI Logo"
              className="h-10 w-auto object-contain drop-shadow-[0_0_14px_rgba(245,158,11,0.4)] transition-transform duration-300 group-hover:scale-105"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-white text-lg tracking-tight">SehatSense</span>
                <span className="text-[10px] font-bold bg-amber-950/70 text-amber-300 border border-amber-800/60 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5 text-amber-400" /> AI
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 font-medium hidden sm:block">Smart Food Choices, Better Health.</p>
            </div>
          </Link>
        </div>

        {/* Center / Right: Quick Actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {/* Quick Log Buttons */}
              <Link
                to="/food-logging"
                className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-amber-300 bg-amber-950/40 hover:bg-amber-900/50 border border-amber-800/60 px-3 py-1.5 rounded-xl transition-all"
              >
                <PlusCircle className="w-4 h-4 text-amber-400" />
                <span>Log Meal</span>
              </Link>

              <Link
                to="/food-logging?tab=image"
                className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-zinc-200 bg-zinc-900/80 hover:bg-zinc-800/80 border border-zinc-800 px-3 py-1.5 rounded-xl transition-all"
              >
                <Camera className="w-4 h-4 text-amber-400" />
                <span>AI Photo Scan</span>
              </Link>

              <Link
                to="/assistant"
                className="flex items-center gap-1.5 text-xs font-bold text-black bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 px-3.5 py-1.5 rounded-xl shadow-md shadow-amber-500/20 transition-all"
              >
                <Bot className="w-4 h-4" />
                <span className="hidden sm:inline">AI Assistant</span>
              </Link>

              {/* Profile dropdown / link */}
              <div className="flex items-center gap-2 pl-2 border-l border-zinc-800">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-zinc-800/60 transition-colors"
                  title="Profile & Settings"
                >
                  <div className="w-8 h-8 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-300 font-bold text-xs">
                    {profile?.display_name ? profile.display_name[0].toUpperCase() : <UserIcon className="w-4 h-4" />}
                  </div>
                  <span className="text-xs font-medium text-zinc-200 hidden lg:inline-block max-w-[100px] truncate">
                    {profile?.display_name || user?.email.split('@')[0]}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-950/30 rounded-xl transition-colors cursor-pointer"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-xs font-semibold text-zinc-300 hover:text-white px-3.5 py-2 rounded-xl hover:bg-zinc-800 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-xs font-bold text-black bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 px-4 py-2 rounded-xl shadow-md shadow-amber-500/20 transition-all"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
