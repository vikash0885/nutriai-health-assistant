import React from 'react';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

interface MedicalDisclaimerProps {
  compact?: boolean;
}

export const MedicalDisclaimer: React.FC<MedicalDisclaimerProps> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-100/80 px-3 py-1.5 rounded-lg border border-slate-200">
        <ShieldAlert className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
        <span>NutriAI is an educational wellness tool and does not provide medical diagnoses or treatment.</span>
      </div>
    );
  }

  return (
    <div className="bg-emerald-50/70 border border-emerald-200/60 rounded-xl p-4 text-sm text-slate-700 flex items-start gap-3 my-4">
      <AlertTriangle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
      <div>
        <h4 className="font-semibold text-emerald-900 text-xs uppercase tracking-wider mb-1">
          Educational & Wellness Safety Notice
        </h4>
        <p className="text-xs text-slate-600 leading-relaxed">
          NutriAI estimates nutritional intake and analyzes self-reported habits for educational purposes only.
          It does not diagnose, treat, or cure medical conditions. If you experience severe, persistent, or worsening symptoms,
          please consult a qualified healthcare professional or seek emergency medical care immediately.
        </p>
      </div>
    </div>
  );
};
