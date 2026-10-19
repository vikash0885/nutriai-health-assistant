import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#070709] border-t border-zinc-800/80 mt-auto py-8 text-zinc-400 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 text-center text-xs space-y-3">
        <div className="flex flex-wrap items-center justify-center gap-6 font-semibold text-sm text-zinc-300">
          <div className="flex items-center gap-2">
            <img src="/images/sehatsense-logo-icon.png" alt="SehatSense AI" className="h-6 w-auto object-contain" />
            <span className="font-extrabold text-base">
              <span className="text-white">Sehat</span>
              <span className="text-amber-400">Sense</span>
              <span className="text-amber-300 font-semibold"> AI</span>
            </span>
          </div>
          <span>•</span>
          <span>Smart Food Choices, Better Health.</span>
          <span>•</span>
          <span className="flex items-center gap-1.5 text-amber-400 font-bold">
            <ShieldCheck className="w-4 h-4 text-amber-400" /> AI Powered
          </span>
        </div>

        <div className="pt-2 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-400 font-medium">
          <p>
            © {new Date().getFullYear()} SehatSense AI. All rights reserved.
          </p>
          <p>
            Intelligent Nutrition & Wellness Platform
          </p>
        </div>
      </div>
    </footer>
  );
};
