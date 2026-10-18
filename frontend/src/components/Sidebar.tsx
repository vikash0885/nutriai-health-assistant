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
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed lg:sticky top-16 z-40 h-[calc(100vh-4rem)] w-64 bg-white border-r border-slate-200 overflow-y-auto transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 space-y-1">
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Core Tracking
          </div>
          {navItems.slice(0, 4).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}

          <div className="pt-3 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            AI & Planning
          </div>
          {navItems.slice(4, 7).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}

          <div className="pt-3 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Health & Insights
          </div>
          {navItems.slice(7, 10).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}

          <div className="pt-3 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Lifestyle & Support
          </div>
          {navItems.slice(10).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </aside>
    </>
  );
};
