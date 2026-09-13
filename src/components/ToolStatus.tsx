import React from 'react';
import { Activity, Sparkles } from 'lucide-react';

interface ToolStatusProps {
  activeTool: string | null;
  verificationMessage?: string | null;
}

export const ToolStatus: React.FC<ToolStatusProps> = ({
  activeTool,
  verificationMessage,
}) => {
  if (!activeTool && !verificationMessage) return null;

  // Format tool name to natural conversational message
  const formatToolDisplay = (tool: string) => {
    switch (tool) {
      case 'findFile':
      case 'fileSearch':
        return 'Searching approved files...';
      case 'powerpointControl':
        return 'Controlling presentation...';
      case 'wifiManager':
      case 'getNetworkStatus':
        return 'Checking Wi-Fi network...';
      case 'mediaControl':
        return 'Controlling media playback...';
      case 'visionAnalyze':
        return 'Analyzing approved screen...';
      case 'launchApplication':
        return 'Launching application...';
      case 'prepareMessage':
        return 'Preparing message draft...';
      case 'sendMessage':
        return 'Sending confirmed message...';
      case 'getDeviceStatus':
        return 'Checking device health & vitals...';
      case 'dailyBriefing':
        return 'Compiling daily briefing...';
      case 'lockSystem':
        return 'Locking system...';
      default:
        return `Executing ${tool}...`;
    }
  };

  return (
    <div className="flex flex-col items-center gap-1.5 my-2 animate-fade-in">
      {activeTool && (
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 text-xs font-mono shadow-lg shadow-cyan-500/10 animate-pulse">
          <Activity className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
          <span>{formatToolDisplay(activeTool)}</span>
        </div>
      )}

      {verificationMessage && (
        <div className="flex items-center gap-1.5 text-[11px] text-teal-300/90 font-mono">
          <Sparkles className="w-3 h-3 text-teal-400" />
          <span>{verificationMessage}</span>
        </div>
      )}
    </div>
  );
};
