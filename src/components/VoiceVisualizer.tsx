import React from 'react';
import { AssistantState } from '../types/assistant';

interface VoiceVisualizerProps {
  state: AssistantState;
}

export const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({ state }) => {
  const isSpeaking = state === 'speaking';
  const isListening = state === 'listening';
  const isConnecting = state === 'connecting';

  return (
    <div className="relative flex items-center justify-center w-64 h-64 my-6">
      {/* Outer Pulse Waves */}
      <div
        className={`absolute inset-0 rounded-full border border-cyan-500/20 transition-all duration-700 ${
          isSpeaking
            ? 'scale-125 opacity-70 animate-ping'
            : isListening
            ? 'scale-110 opacity-50 animate-pulse'
            : 'scale-95 opacity-20'
        }`}
      />

      {/* Futuristic Orbiting Rings */}
      <div
        className={`absolute inset-4 rounded-full border border-dashed border-cyan-400/40 transition-transform duration-1000 ${
          isConnecting
            ? 'animate-spin border-cyan-400'
            : isSpeaking
            ? 'animate-spin border-fuchsia-500'
            : isListening
            ? 'animate-pulse border-cyan-300'
            : 'opacity-30'
        }`}
        style={{ animationDuration: isConnecting ? '3s' : '8s' }}
      />

      {/* Core Glowing Orb */}
      <div
        className={`relative w-36 h-36 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 ${
          isSpeaking
            ? 'bg-gradient-to-tr from-fuchsia-600 via-pink-500 to-cyan-400 shadow-fuchsia-500/50 scale-110'
            : isListening
            ? 'bg-gradient-to-tr from-cyan-600 via-teal-500 to-indigo-500 shadow-cyan-500/50 scale-105'
            : isConnecting
            ? 'bg-gradient-to-tr from-amber-600 via-cyan-600 to-blue-500 shadow-amber-500/40 animate-pulse'
            : 'bg-gradient-to-tr from-slate-800 to-slate-900 shadow-cyan-950/20 border border-slate-700/50'
        }`}
      >
        {/* Visualizer Frequency Bars */}
        <div className="flex items-center gap-1.5 h-12">
          {[40, 70, 100, 60, 85, 45, 90, 60].map((baseHeight, i) => (
            <span
              key={i}
              className={`w-1 rounded-full transition-all duration-150 ${
                isSpeaking
                  ? 'bg-white/90 animate-bounce'
                  : isListening
                  ? 'bg-white/80'
                  : 'bg-slate-500/40 h-2'
              }`}
              style={{
                height: isSpeaking
                  ? `${Math.max(12, baseHeight * 0.45)}px`
                  : isListening
                  ? `${Math.max(8, baseHeight * 0.25)}px`
                  : '4px',
                animationDelay: `${i * 90}ms`,
                animationDuration: '600ms',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
