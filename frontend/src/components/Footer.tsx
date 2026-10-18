import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500 space-y-3">
        <div className="flex flex-wrap items-center justify-center gap-6 font-medium text-slate-600">
          <span>NutriAI — Personal Food, Health & Fitness Intelligence</span>
          <span>•</span>
          <span>Eat Smart, Live Healthy</span>
          <span>•</span>
          <span className="flex items-center gap-1 text-emerald-700">
            <ShieldCheck className="w-3.5 h-3.5" /> Google Gemini API Powered
          </span>
        </div>

        <p className="max-w-3xl mx-auto text-slate-400 leading-relaxed text-[11px]">
          Medical Disclaimer: NutriAI provides nutritional education, habit tracking, and lifestyle insights.
          It does not provide medical diagnosis, treatment, or cure for diseases.
          Always consult a licensed medical practitioner for health concerns or major dietary modifications.
        </p>

        <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1 pt-2">
          Designed with <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" /> for balanced living across Indian & global food cultures. © {new Date().getFullYear()} NutriAI.
        </p>
      </div>
    </footer>
  );
};
