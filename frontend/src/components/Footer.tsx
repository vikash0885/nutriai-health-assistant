import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#070709] border-t border-zinc-800/80 mt-auto py-8 text-zinc-400 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 text-center text-xs space-y-3">
        <div className="flex flex-wrap items-center justify-center gap-6 font-medium text-zinc-300">
          <div className="flex items-center gap-2">
            <img src="/images/sehatsense-logo-icon.png" alt="SehatSense AI" className="h-6 w-auto object-contain" />
            <span className="font-bold">
              <span className="text-white">Sehat</span>
              <span className="text-amber-400">Sense</span>
              <span className="text-amber-300 font-semibold"> AI</span>
            </span>
          </div>
          <span>•</span>
          <span>Smart Food Choices, Better Health.</span>
          <span>•</span>
          <span className="flex items-center gap-1 text-amber-400 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> AI Powered
          </span>
        </div>

        <div className="pt-2 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-[12px] text-zinc-400">
          <p className="text-[11px] text-zinc-400">
            © {new Date().getFullYear()} SehatSense AI. All rights reserved.
          </p>
          <p className="font-medium text-zinc-300 flex items-center gap-1.5 bg-[#0d0d12] px-3 py-1 rounded-full border border-zinc-800 shadow-2xs">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>by <strong className="text-amber-300 font-semibold">Vikash Mishra</strong></span>
          </p>
        </div>
      </div>
    </footer>
  );
};
