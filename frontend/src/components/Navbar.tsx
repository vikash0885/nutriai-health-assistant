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
    <header className="sticky top-0 z-40 bg-[#0f172a]/95 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Mobile Toggle & Logo */}
        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#172554] via-blue-950 to-violet-600 flex items-center justify-center shadow-md shadow-violet-900/20 text-white font-black text-lg">
              S
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-white text-lg tracking-tight">SehatSense</span>
                <span className="text-[10px] font-bold bg-violet-950/80 text-violet-300 border border-violet-800/60 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5 text-violet-400" /> AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">Smart Food Choices, Better Health.</p>
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
                className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-violet-300 bg-violet-950/60 hover:bg-violet-900/60 border border-violet-800/60 px-3 py-1.5 rounded-xl transition-all"
              >
                <PlusCircle className="w-4 h-4 text-violet-400" />
                <span>Log Meal</span>
              </Link>

              <Link
                to="/food-logging?tab=image"
                className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 px-3 py-1.5 rounded-xl transition-all"
              >
                <Camera className="w-4 h-4 text-violet-400" />
                <span>AI Photo Scan</span>
              </Link>

              <Link
                to="/assistant"
                className="flex items-center gap-1.5 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 px-3 py-1.5 rounded-xl shadow-md shadow-violet-600/20 transition-all"
              >
                <Bot className="w-4 h-4" />
                <span className="hidden sm:inline">AI Assistant</span>
              </Link>

              {/* Profile dropdown / link */}
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-800/60 transition-colors"
                  title="Profile & Settings"
                >
                  <div className="w-8 h-8 rounded-full bg-violet-950 border border-violet-800 flex items-center justify-center text-violet-300 font-bold text-xs">
                    {profile?.display_name ? profile.display_name[0].toUpperCase() : <UserIcon className="w-4 h-4" />}
                  </div>
                  <span className="text-xs font-medium text-slate-200 hidden lg:inline-block max-w-[100px] truncate">
                    {profile?.display_name || user?.email.split('@')[0]}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded-xl transition-colors cursor-pointer"
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
                className="text-xs font-semibold text-slate-300 hover:text-white px-3.5 py-2 rounded-xl hover:bg-slate-800 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded-xl shadow-md shadow-violet-600/20 transition-all"
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
