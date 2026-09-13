import React from 'react';
import { SystemAgentStatus } from '../types/assistant';

interface ConnectionIndicatorProps {
  isAiConnected: boolean;
  systemStatus: SystemAgentStatus;
  micReady: boolean;
}

export const ConnectionIndicator: React.FC<ConnectionIndicatorProps> = ({
  isAiConnected,
  systemStatus,
  micReady,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 px-4 py-2 rounded-2xl bg-slate-900/70 border border-slate-800 text-[11px] font-medium backdrop-blur-md shadow-lg shadow-black/40">
      {/* 1. Gemini Live */}
      <div className="flex items-center gap-1.5">
        <span
          className={`w-2 h-2 rounded-full ${
            isAiConnected ? 'bg-cyan-400 shadow-sm shadow-cyan-400 animate-pulse' : 'bg-slate-600'
          }`}
        />
        <span className={isAiConnected ? 'text-cyan-300' : 'text-slate-400'}>
          {isAiConnected ? 'Gemini Live' : 'AI Offline'}
        </span>
      </div>

      <span className="text-slate-700 select-none">•</span>

      {/* 2. Microphone */}
      <div className="flex items-center gap-1.5">
        <span
          className={`w-2 h-2 rounded-full ${
            micReady ? 'bg-emerald-400 shadow-sm shadow-emerald-400' : 'bg-amber-500'
          }`}
        />
        <span className={micReady ? 'text-emerald-300' : 'text-amber-400/80'}>
          {micReady ? 'Mic Ready' : 'Mic Idle'}
        </span>
      </div>

      <span className="text-slate-700 select-none">•</span>

      {/* 3. System Agent */}
      <div className="flex items-center gap-1.5">
        <span
          className={`w-2 h-2 rounded-full ${
            systemStatus.connected
              ? 'bg-emerald-400 shadow-sm shadow-emerald-400'
              : 'border border-amber-500 bg-transparent'
          }`}
        />
        <span className={systemStatus.connected ? 'text-emerald-300' : 'text-amber-400/80'}>
          {systemStatus.connected ? 'System Agent' : 'Agent Offline'}
        </span>
      </div>

      <span className="text-slate-700 select-none">•</span>

      {/* 4. Tools Ready */}
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-cyan-400" />
        <span className="text-slate-300">
          Tools Ready (33)
        </span>
      </div>
    </div>
  );
};
