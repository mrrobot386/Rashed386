import React from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { AssistantState } from '../types/assistant';

interface MicButtonProps {
  state: AssistantState;
  onClick: () => void;
}

export const MicButton: React.FC<MicButtonProps> = ({ state, onClick }) => {
  const isConnecting = state === 'connecting';
  const isActive = state === 'listening' || state === 'speaking';

  return (
    <button
      onClick={onClick}
      disabled={isConnecting}
      aria-label={isActive ? 'Stop conversation' : 'Start conversation with Anisa'}
      className={`group relative flex items-center justify-center w-20 h-20 rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-400/40 ${
        isActive
          ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg shadow-pink-600/40 scale-105 active:scale-95'
          : isConnecting
          ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30'
          : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30 hover:scale-105 active:scale-95'
      }`}
    >
      {/* Ripple ring when active */}
      {isActive && (
        <span className="absolute inset-0 rounded-full bg-pink-500 animate-ping opacity-25" />
      )}

      {isConnecting ? (
        <Loader2 className="w-8 h-8 animate-spin" />
      ) : isActive ? (
        <MicOff className="w-8 h-8 transition-transform group-hover:scale-110" />
      ) : (
        <Mic className="w-8 h-8 transition-transform group-hover:scale-110" />
      )}
    </button>
  );
};
