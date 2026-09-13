import React from 'react';
import { AssistantState } from '../types/assistant';

interface StatusIndicatorProps {
  state: AssistantState;
  activeTool?: string | null;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ state, activeTool }) => {
  const getStatusText = () => {
    if (activeTool) {
      return `Executing ${activeTool}...`;
    }
    switch (state) {
      case 'connecting':
        return 'Connecting to Anisa...';
      case 'listening':
        return 'Listening... Speak naturally';
      case 'speaking':
        return 'Anisa is speaking...';
      case 'error':
        return 'Connection error';
      case 'disconnected':
      default:
        return 'Tap microphone to talk';
    }
  };

  return (
    <div className="flex flex-col items-center gap-1 my-2">
      <div className="text-lg font-medium tracking-wide text-slate-200">
        {getStatusText()}
      </div>
      <p className="text-xs text-cyan-400/80 tracking-wider uppercase font-mono">
        Bengali • English • Hindi
      </p>
    </div>
  );
};
