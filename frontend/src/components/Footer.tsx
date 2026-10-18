import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0f172a] border-t border-slate-800 mt-auto py-8 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs space-y-3">
        <div className="flex flex-wrap items-center justify-center gap-6 font-medium text-slate-300">
          <span className="font-bold text-white">SehatSense AI</span>
          <span>•</span>
          <span>Smart Food Choices, Better Health.</span>
          <span>•</span>
          <span className="flex items-center gap-1 text-violet-400 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-violet-400" /> AI Powered
          </span>
        </div>

        <p className="max-w-3xl mx-auto text-slate-400 leading-relaxed text-[11px]">
          Medical Disclaimer: SehatSense AI provides nutritional education, habit tracking, and lifestyle insights.
          It does not provide medical diagnosis, treatment, or cure for diseases.
          Always consult a licensed medical practitioner for health concerns or major dietary modifications.
        </p>

        <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-[12px] text-slate-400">
          <p className="text-[11px] text-slate-400">
            © {new Date().getFullYear()} SehatSense AI. All rights reserved.
          </p>
          <p className="font-medium text-slate-300 flex items-center gap-1.5 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-800 shadow-2xs">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>by <strong className="text-white font-semibold">Vikash Mishra</strong></span>
          </p>
        </div>
      </div>
    </footer>
  );
};
