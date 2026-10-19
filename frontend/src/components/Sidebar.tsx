import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  UtensilsCrossed,
  PlusCircle,
  PieChart,
  CalendarCheck2,
  ShoppingCart,
  ArrowLeftRight,
  ActivitySquare,
  Sparkles,
  TrendingUp,
  Dumbbell,
  Droplet,
  Bot,
  Settings,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/food-diary', label: 'Food Diary', icon: UtensilsCrossed },
    { to: '/food-logging', label: 'Log Food / AI Photo', icon: PlusCircle },
    { to: '/nutrition', label: 'Nutrition Analysis', icon: PieChart },
    { to: '/meal-planner', label: 'AI Meal Planner', icon: CalendarCheck2 },
    { to: '/grocery-list', label: 'Grocery List', icon: ShoppingCart },
    { to: '/alternatives', label: 'Eat This, Try This', icon: ArrowLeftRight },
    { to: '/symptoms', label: 'Symptom Diary', icon: ActivitySquare },
    { to: '/patterns', label: 'Food & Symptom Insights', icon: Sparkles },
    { to: '/habits', label: 'Habit Insights', icon: TrendingUp },
    { to: '/exercise', label: 'Exercise & Digestion', icon: Dumbbell },
    { to: '/water', label: 'Water Tracker', icon: Droplet },
    { to: '/assistant', label: 'AI Chat Assistant', icon: Bot },
    { to: '/profile', label: 'Settings & Privacy', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#0F172A]/40 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed lg:sticky top-16 z-40 h-[calc(100vh-4rem)] w-64 flex-shrink-0 bg-[#070709] border-r border-zinc-800/80 overflow-y-auto transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-3 space-y-3">
          {/* Core Tracking Box - Deep Emerald */}
          <div className="bg-gradient-to-br from-[#061e14]/80 via-[#03130c]/85 to-[#010905]/90 rounded-2xl p-2 border border-emerald-500/30 shadow-md space-y-1">
            <div className="px-2.5 py-1 text-[11px] font-black uppercase tracking-wider text-emerald-400 flex items-center justify-between">
              <span>Core Tracking</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            {navItems.slice(0, 4).map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[14px] font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-500/25 text-emerald-200 font-bold border-l-3 border-emerald-400 shadow-sm shadow-emerald-950/40'
                      : 'text-zinc-300 hover:text-white hover:bg-emerald-950/30'
                  }`
                }
              >
                <item.icon className="w-4.5 h-4.5 flex-shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>

          {/* AI & Planning Box - Royal Amethyst / Violet */}
          <div className="bg-gradient-to-br from-[#1c082e]/80 via-[#10041b]/85 to-[#08020e]/90 rounded-2xl p-2 border border-purple-500/35 shadow-md shadow-purple-950/20 space-y-1">
            <div className="px-2.5 py-1 text-[11px] font-black uppercase tracking-wider text-purple-300 flex items-center justify-between">
              <span>AI & Planning</span>
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            </div>
            {navItems.slice(4, 7).map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[14px] font-semibold transition-all ${
                    isActive
                      ? 'bg-purple-500/25 text-purple-200 font-bold border-l-3 border-purple-400 shadow-sm shadow-purple-950/40'
                      : 'text-zinc-300 hover:text-white hover:bg-purple-950/30'
                  }`
                }
              >
                <item.icon className="w-4.5 h-4.5 flex-shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>

          {/* Health & Insights Box - Deep Sapphire Blue */}
          <div className="bg-gradient-to-br from-[#071530]/80 via-[#040c1d]/85 to-[#020610]/90 rounded-2xl p-2 border border-sky-500/30 shadow-md space-y-1">
            <div className="px-2.5 py-1 text-[11px] font-black uppercase tracking-wider text-sky-300 flex items-center justify-between">
              <span>Health & Insights</span>
              <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
            </div>
            {navItems.slice(7, 10).map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[14px] font-semibold transition-all ${
                    isActive
                      ? 'bg-sky-500/25 text-sky-200 font-bold border-l-3 border-sky-400 shadow-sm shadow-sky-950/40'
                      : 'text-zinc-300 hover:text-white hover:bg-sky-950/30'
                  }`
                }
              >
                <item.icon className="w-4.5 h-4.5 flex-shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>

          {/* Lifestyle & Support Box - Warm Amber Terracotta */}
          <div className="bg-gradient-to-br from-[#241305]/80 via-[#150a02]/85 to-[#0b0501]/90 rounded-2xl p-2 border border-amber-500/35 shadow-md shadow-amber-950/20 space-y-1">
            <div className="px-2.5 py-1 text-[11px] font-black uppercase tracking-wider text-amber-300 flex items-center justify-between">
              <span>Lifestyle & Support</span>
              <Settings className="w-3.5 h-3.5 text-amber-400" />
            </div>
            {navItems.slice(10).map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[14px] font-semibold transition-all ${
                    isActive
                      ? 'bg-amber-500/25 text-amber-200 font-bold border-l-3 border-amber-400 shadow-sm shadow-amber-950/40'
                      : 'text-zinc-300 hover:text-white hover:bg-amber-950/30'
                  }`
                }
              >
                <item.icon className="w-4.5 h-4.5 flex-shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
};
