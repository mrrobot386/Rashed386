import React, { useState } from 'react';
import {
  Sparkles,
  HelpCircle,
  X,
  ShieldCheck,
  Tv,
  MessageSquare,
  FileSearch,
  Volume2,
  Activity,
  CheckCircle2,
  Settings,
} from 'lucide-react';
import { useAnisaLive } from '../hooks/useAnisaLive';
import { VoiceVisualizer } from './VoiceVisualizer';
import { MicButton } from './MicButton';
import { StatusIndicator } from './StatusIndicator';
import { ConnectionIndicator } from './ConnectionIndicator';
import { ToolStatus } from './ToolStatus';
import { EmergencyStop } from './EmergencyStop';
import { ConfirmationDialog } from './ConfirmationDialog';
import { SettingsPanel } from './SettingsPanel';

export const AssistantUI: React.FC = () => {
  const {
    state,
    error,
    activeTool,
    verificationMessage,
    systemStatus,
    presentationMode,
    micPermissionReady,
    pendingConfirmation,
    confirmPendingAction,
    cancelPendingAction,
    toggleSession,
    reconnect,
    emergencyStop,
    togglePresentationMode,
  } = useAnisaLive();

  const [showHelp, setShowHelp] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const isAiConnected = state === 'listening' || state === 'speaking';

  const powerSuggestions = [
    'Anisa, YouTube open করো',
    'Chrome খুলে দাও please',
    'আমার presentationটা find করে open করো',
    'Music pause করে next song চালাও',
    'Rahim-এর WhatsApp chat খুলে দাও',
    'Give me my daily briefing',
    'Check my device status',
    'Lock my computer',
  ];

  return (
    <div className="relative flex flex-col items-center justify-between min-h-screen w-full bg-[#04060d] text-white select-none px-4 py-5 overflow-hidden">
      {/* Ambient futuristic background glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-teal-500/[0.03] rounded-full blur-[160px] pointer-events-none" />

      {/* Top Header Bar */}
      <header className="w-full max-w-lg flex items-center justify-between z-10 pt-1">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-md shadow-cyan-400" />
            <div className="absolute w-5 h-5 rounded-full border border-cyan-400/40 animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-fuchsia-400">
                ANISA AI ULTRA
              </h1>
              <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-700/50 uppercase">
                V2
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono tracking-wide hidden sm:block">
              Your Voice. Your Intelligence. Your Control.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Dedicated Presentation Mode Toggle */}
          <button
            onClick={togglePresentationMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
              presentationMode
                ? 'bg-amber-500/20 border-amber-500/80 text-amber-300 shadow-sm shadow-amber-500/30'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Dedicated Presentation Mode"
            aria-label="Presentation Mode"
          >
            <Tv className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Slides</span>
          </button>

          {/* Emergency Stop Button */}
          <EmergencyStop onTrigger={emergencyStop} isActive={state !== 'disconnected'} />

          {/* Settings Button */}
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-cyan-300 transition-colors"
            title="Settings and Preferences"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Capabilities Help Button */}
          <button
            onClick={() => setShowHelp(true)}
            className="p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-cyan-300 transition-colors"
            aria-label="Capabilities and voice commands"
            title="Command Examples & Capabilities"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Health Monitor Bar */}
      <div className="z-10 mt-2">
        <ConnectionIndicator
          isAiConnected={isAiConnected}
          systemStatus={systemStatus}
          micReady={micPermissionReady}
        />
      </div>

      {/* Presentation Mode Active Banner */}
      {presentationMode && (
        <div className="z-10 mt-2 flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/40 border border-amber-600/50 text-amber-300 text-xs animate-fade-in">
          <Tv className="w-3.5 h-3.5 text-amber-400" />
          <span>Presentation Mode active: Slide commands prioritized</span>
        </div>
      )}

      {/* Centerpiece: Glowing Orb, Audio Visualizer, and Subtle Tool Status */}
      <main className="flex flex-col items-center justify-center my-auto z-10 w-full max-w-md">
        <VoiceVisualizer state={state} />
        <StatusIndicator state={state} activeTool={activeTool} />

        {/* Subtle Non-Chat Tool Execution Status */}
        <ToolStatus activeTool={activeTool} verificationMessage={verificationMessage} />

        {/* First Run Guidance Banner */}
        {state === 'disconnected' && !error && (
          <div className="mt-4 text-center animate-fade-in">
            <h2 className="text-sm font-semibold text-slate-200 tracking-wide">
              Your intelligent voice assistant.
            </h2>
            <p className="text-xs text-cyan-400/80 font-mono mt-0.5">
              Tap the microphone to begin.
            </p>
          </div>
        )}

        {/* Error notification banner */}
        {error && (
          <div className="mt-3 px-4 py-2 rounded-xl bg-red-950/60 border border-red-800/80 text-red-300 text-xs text-center max-w-xs animate-fade-in">
            {error}
          </div>
        )}
      </main>

      {/* Action Footer */}
      <footer className="w-full max-w-lg flex flex-col items-center gap-3.5 z-10 pb-1">
        {/* Suggested Voice Commands Chips */}
        <div className="w-full overflow-x-auto no-scrollbar py-1 flex items-center gap-2 px-1">
          {powerSuggestions.map((cmd, idx) => (
            <div
              key={idx}
              className="shrink-0 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300 font-medium hover:border-cyan-500/40 transition-colors"
            >
              {cmd}
            </div>
          ))}
        </div>

        {/* Central Glowing Mic Button */}
        <MicButton state={state} onClick={toggleSession} />

        <div className="text-center text-xs text-slate-400 font-mono">
          {state === 'disconnected'
            ? 'Tap microphone to awaken Anisa'
            : state === 'listening'
            ? 'Listening... Speak in Bengali, English, or Hindi'
            : state === 'speaking'
            ? 'Anisa is speaking... Speak to interrupt'
            : 'Processing command...'}
        </div>
      </footer>

      {/* Confirmation Dialog for Sensitive Actions */}
      <ConfirmationDialog
        isOpen={Boolean(pendingConfirmation)}
        title="Permission Required"
        description={pendingConfirmation?.description || 'Confirm action to proceed.'}
        toolName={pendingConfirmation?.tool || ''}
        actionName={pendingConfirmation?.action}
        onConfirm={confirmPendingAction}
        onCancel={cancelPendingAction}
      />

      {/* Settings Modal */}
      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onReconnect={reconnect}
        isAgentConnected={systemStatus.connected}
      />

      {/* Capabilities Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 max-h-[88vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-lg">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <span>ANISA AI ULTRA — Architecture & Commands</span>
              </div>
              <button
                onClick={() => setShowHelp(false)}
                className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              ANISA AI ULTRA operates on a permission-based personal AI operating layer. She executes intent across registered system, browser, and multimedia tools:
            </p>

            <div className="space-y-2.5 text-xs">
              {/* 1. App Launcher */}
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
                <div className="flex items-center gap-2 text-cyan-400 font-semibold mb-1">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>App Launcher & Smart Actions</span>
                </div>
                <p className="text-slate-300 font-mono">"Anisa, WhatsApp খুলে দাও" • "Chrome চালু করো" • "Open YouTube"</p>
                <p className="text-slate-400 text-[11px] mt-1">Launches approved applications safely via registered system adapters.</p>
              </div>

              {/* 2. Contacts & Messaging */}
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
                <div className="flex items-center gap-2 text-teal-400 font-semibold mb-1">
                  <MessageSquare className="w-4 h-4 text-teal-400" />
                  <span>WhatsApp Contact & Staged Messaging</span>
                </div>
                <p className="text-slate-300 font-mono">"Rahim-এর WhatsApp chat খুলে দাও" • "Prepare message saying I'll call later"</p>
                <p className="text-slate-400 text-[11px] mt-1">Drafts message first. Never sends silently without your explicit voice confirmation.</p>
              </div>

              {/* 3. Device Health & Status */}
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
                <div className="flex items-center gap-2 text-indigo-400 font-semibold mb-1">
                  <Activity className="w-4 h-4 text-indigo-400" />
                  <span>Device Health & Vitals</span>
                </div>
                <p className="text-slate-300 font-mono">"Device status check করো" • "Give me my daily briefing"</p>
                <p className="text-slate-400 text-[11px] mt-1">Reports battery %, CPU, RAM, storage, Wi-Fi status, and system uptime.</p>
              </div>

              {/* 4. File Intelligence */}
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
                <div className="flex items-center gap-2 text-fuchsia-400 font-semibold mb-1">
                  <FileSearch className="w-4 h-4 text-fuchsia-400" />
                  <span>File Intelligence & Compound Tasks</span>
                </div>
                <p className="text-slate-300 font-mono">"আমার Downloads থেকে presentation খুঁজে দাও" • "Find presentation and start slideshow"</p>
                <p className="text-slate-400 text-[11px] mt-1">Safely searches inside Downloads, Documents, and Desktop folders.</p>
              </div>

              {/* 5. Presentations & Media */}
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
                <div className="flex items-center gap-2 text-amber-400 font-semibold mb-1">
                  <Volume2 className="w-4 h-4 text-amber-400" />
                  <span>Media Control & Presentation Mode</span>
                </div>
                <p className="text-slate-300 font-mono">"Anisa, music pause করো" • "Slide 8 এ যাও" • "Next slide"</p>
                <p className="text-slate-400 text-[11px] mt-1">Controls PowerPoint slide shows and OS media playback instantly.</p>
              </div>
            </div>

            {/* Security Guarantee */}
            <div className="mt-1 p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-700/50 flex items-start gap-2.5 text-xs text-cyan-300">
              <ShieldCheck className="w-5 h-5 shrink-0 text-cyan-400 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-semibold text-cyan-200">Zero Arbitrary Shell Execution: </span>
                All voice requests route strictly through Gemini Live, intent classification, permission gates, and registered application adapters.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
