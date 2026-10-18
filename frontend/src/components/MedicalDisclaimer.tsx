import React from 'react';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

interface MedicalDisclaimerProps {
  compact?: boolean;
}

export const MedicalDisclaimer: React.FC<MedicalDisclaimerProps> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-100/80 px-3 py-1.5 rounded-xl border border-slate-200">
        <ShieldAlert className="w-3.5 h-3.5 text-violet-600 flex-shrink-0" />
        <span>SehatSense AI is an educational wellness tool and does not provide medical diagnoses or treatment.</span>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 text-sm text-slate-700 flex items-start gap-3 my-4 shadow-sm">
      <div className="p-2 rounded-xl bg-violet-50 text-violet-700 flex-shrink-0">
        <AlertTriangle className="w-4 h-4" />
      </div>
      <div>
        <h4 className="font-bold text-[#172554] text-xs uppercase tracking-wider mb-1">
          Educational & Wellness Safety Notice
        </h4>
        <p className="text-xs text-slate-600 leading-relaxed">
          SehatSense AI estimates nutritional intake and analyzes self-reported habits for educational purposes only.
          It does not diagnose, treat, or cure medical conditions. If you experience severe, persistent, or worsening symptoms,
          please consult a qualified healthcare professional or seek emergency medical care immediately.
        </p>
      </div>
    </div>
  );
};
