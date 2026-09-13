import React from 'react';
import { Power } from 'lucide-react';

interface EmergencyStopProps {
  onTrigger: () => void;
  isActive?: boolean;
}

export const EmergencyStop: React.FC<EmergencyStopProps> = ({ onTrigger, isActive = false }) => {
  return (
    <button
      onClick={onTrigger}
      className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all text-xs font-semibold ${
        isActive
          ? 'bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-600/40 animate-pulse'
          : 'bg-rose-950/60 border-rose-600/60 text-rose-300 hover:bg-rose-900/80 hover:border-rose-500 active:scale-95'
      }`}
      title="Emergency Stop: Instantly stops mic, audio, and all pending automation"
      aria-label="Emergency Stop"
    >
      <Power className="w-3.5 h-3.5 text-rose-400 group-hover:rotate-90 transition-transform duration-200" />
      <span>Stop</span>
    </button>
  );
};
