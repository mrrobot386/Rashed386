import React from 'react';
import { SystemAgentStatus } from '../types/assistant';

interface ConnectionIndicatorProps {
  isAiConnected: boolean;
  systemStatus: SystemAgentStatus;
}

export const ConnectionIndicator: React.FC<ConnectionIndicatorProps> = ({
  isAiConnected,
  systemStatus,
}) => {
  return (
    <div className="flex items-center gap-4 px-4 py-2 rounded-full bg-slate-900/60 border border-slate-800 text-xs backdrop-blur-md">
      <div className="flex items-center gap-1.5">
        <span
          className={`w-2 h-2 rounded-full ${
            isAiConnected ? 'bg-cyan-400 animate-pulse' : 'bg-slate-600'
          }`}
        />
        <span className="text-slate-300">
          {isAiConnected ? 'Gemini Live' : 'AI Offline'}
        </span>
      </div>

      <div className="w-px h-3 bg-slate-700" />

      <div className="flex items-center gap-1.5">
        <span
          className={`w-2 h-2 rounded-full ${
            systemStatus.connected ? 'bg-emerald-400' : 'bg-amber-500/80'
          }`}
        />
        <span className="text-slate-300">
          {systemStatus.connected ? 'System Agent' : 'Agent Offline'}
        </span>
      </div>
    </div>
  );
};
