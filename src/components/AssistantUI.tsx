import React, { useState } from 'react';
import { Sparkles, HelpCircle, X, ShieldCheck } from 'lucide-react';
import { useAnisaLive } from '../hooks/useAnisaLive';
import { VoiceVisualizer } from './VoiceVisualizer';
import { MicButton } from './MicButton';
import { StatusIndicator } from './StatusIndicator';
import { ConnectionIndicator } from './ConnectionIndicator';

export const AssistantUI: React.FC = () => {
  const {
    state,
    error,
    activeTool,
    systemStatus,
    toggleSession,
  } = useAnisaLive();

  const [showHelp, setShowHelp] = useState(false);
  const isAiConnected = state === 'listening' || state === 'speaking';

  return (
    <div className="relative flex flex-col items-center justify-between min-h-screen w-full bg-[#050811] text-white select-none px-6 py-8 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Bar */}
      <header className="w-full max-w-md flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400" />
          <h1 className="text-xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-fuchsia-400">
            ANISA AI
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHelp(true)}
            className="p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-cyan-300 transition-colors"
            aria-label="Capabilities and voice commands"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Status Bar */}
      <div className="z-10 mt-2">
        <ConnectionIndicator
          isAiConnected={isAiConnected}
          systemStatus={systemStatus}
        />
      </div>

      {/* Centerpiece: Glowing Orb and Audio Visualizer */}
      <main className="flex flex-col items-center justify-center my-auto z-10">
        <VoiceVisualizer state={state} />
        <StatusIndicator state={state} activeTool={activeTool} />

        {/* Error notification banner */}
        {error && (
          <div className="mt-4 px-4 py-2 rounded-xl bg-red-950/60 border border-red-800/80 text-red-300 text-xs text-center max-w-xs animate-fade-in">
            {error}
          </div>
        )}
      </main>

      {/* Action Footer */}
      <footer className="w-full max-w-md flex flex-col items-center gap-4 z-10">
        <MicButton state={state} onClick={toggleSession} />

        <div className="text-center text-xs text-slate-500 font-mono">
          {state === 'disconnected' ? 'Tap mic to awaken Anisa' : 'Tap mic again to sleep'}
        </div>
      </footer>

      {/* Capabilities Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold text-lg">
                <Sparkles className="w-5 h-5" />
                <span>Voice Commands</span>
              </div>
              <button
                onClick={() => setShowHelp(false)}
                className="p-2 rounded-full hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Anisa is an intelligent voice assistant. Speak naturally in English, Bengali, or Hindi:
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-cyan-400 font-medium">"Give me my daily briefing"</span>
                <p className="text-slate-400 mt-0.5">Date, time, system health vitals, battery</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-cyan-400 font-medium">"What's my Wi-Fi status?"</span>
                <p className="text-slate-400 mt-0.5">Checks network connection and signal</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-cyan-400 font-medium">"Pause the music" / "Next track"</span>
                <p className="text-slate-400 mt-0.5">Controls universal OS media playback</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-cyan-400 font-medium">"Lock my computer"</span>
                <p className="text-slate-400 mt-0.5">Locks your workstation securely</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-cyan-400 font-medium">"Open YouTube"</span>
                <p className="text-slate-400 mt-0.5">Opens verified secure web destinations</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-cyan-400 font-medium">"Start my PowerPoint"</span>
                <p className="text-slate-400 mt-0.5">Slideshow navigation, next/previous slides</p>
              </div>
            </div>

            <div className="mt-2 p-3 rounded-xl bg-cyan-950/30 border border-cyan-800/40 flex items-center gap-2 text-xs text-cyan-300">
              <ShieldCheck className="w-4 h-4 shrink-0 text-cyan-400" />
              <span>Voice-to-voice privacy. No arbitrary execution allowed.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
