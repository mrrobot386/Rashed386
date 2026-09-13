import React, { useState, useEffect } from 'react';
import {
  X,
  Settings,
  Mic,
  Server,
  Sparkles,
  FolderLock,
  Trash2,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';
import { PreferencesManager } from '../memory/Preferences';
import { MemoryManager } from '../memory/MemoryManager';
import { UserPreferences, MemoryEntry } from '../types/memory';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onReconnect: () => void;
  isAgentConnected: boolean;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
  onReconnect,
  isAgentConnected,
}) => {
  const [prefs, setPrefs] = useState<UserPreferences>(PreferencesManager.getPreferences());
  const [memories, setMemories] = useState<MemoryEntry[]>([]);
  const [clearStatus, setClearStatus] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setPrefs(PreferencesManager.getPreferences());
      setMemories(MemoryManager.getEntries());
      setClearStatus(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLanguageChange = (lang: UserPreferences['preferredLanguage']) => {
    const updated = PreferencesManager.savePreferences({ preferredLanguage: lang });
    setPrefs(updated);
  };

  const handleResponseLength = (len: UserPreferences['responseLength']) => {
    const updated = PreferencesManager.savePreferences({ responseLength: len });
    setPrefs(updated);
  };

  const handleClearMemory = () => {
    const res = MemoryManager.clearAll();
    setMemories([]);
    setClearStatus(res.message);
    setTimeout(() => setClearStatus(null), 3000);
  };

  const handleForgetKey = (key: string) => {
    MemoryManager.forget(key);
    setMemories(MemoryManager.getEntries());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-base">
            <Settings className="w-5 h-5 text-cyan-400" />
            <span>ANISA AI ULTRA Settings</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Connections & Reconnect */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Connections & Diagnostics</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-cyan-400" />
                <span>System Agent</span>
              </div>
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded ${isAgentConnected ? 'bg-teal-950 text-teal-300' : 'bg-rose-950 text-rose-400'}`}>
                {isAgentConnected ? 'Online' : 'Offline'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-cyan-400" />
                <span>Microphone</span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-teal-950 text-teal-300">
                16kHz PCM
              </span>
            </div>
          </div>

          <button
            onClick={onReconnect}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-700/50 text-cyan-300 text-xs font-medium transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Reconnect Live Voice & Agent</span>
          </button>
        </div>

        {/* 2. Language & Behavior */}
        <div className="space-y-3 border-t border-slate-800 pt-3">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Voice & Language Adaptation</h4>
          <div className="flex flex-col gap-2">
            <label className="text-xs text-slate-300">Response Language Preference</label>
            <div className="grid grid-cols-4 gap-2 text-xs">
              {[
                { id: 'auto', label: 'Auto (Detect)' },
                { id: 'bn', label: 'বাংলা' },
                { id: 'en', label: 'English' },
                { id: 'hi', label: 'हिंदी' },
              ].map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => handleLanguageChange(lang.id as any)}
                  className={`py-1.5 px-2 rounded-xl border text-xs font-medium transition-all ${
                    prefs.preferredLanguage === lang.id
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-slate-300">Response Length</label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {(['concise', 'balanced', 'detailed'] as const).map((len) => (
                <button
                  key={len}
                  onClick={() => handleResponseLength(len)}
                  className={`capitalize py-1.5 px-2 rounded-xl border text-xs font-medium transition-all ${
                    prefs.responseLength === len
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {len}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Approved Folders */}
        <div className="space-y-2 border-t border-slate-800 pt-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <FolderLock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Approved Directory Boundaries</span>
            </h4>
            <span className="text-[10px] text-teal-400 font-mono">Restricted</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {prefs.approvedFolders.map((f, i) => (
              <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 border border-slate-800 text-xs font-mono">
                {f}
              </span>
            ))}
          </div>
          <p className="text-[11px] text-slate-500">
            Operations strictly restricted from accessing system files, credentials, or private app stores.
          </p>
        </div>

        {/* 4. Memory & Privacy */}
        <div className="space-y-3 border-t border-slate-800 pt-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
              <span>User Memory & Learned Preferences</span>
            </h4>
            <button
              onClick={handleClearMemory}
              className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear Memory</span>
            </button>
          </div>

          {clearStatus && (
            <div className="text-xs text-teal-300 bg-teal-950/60 p-2 rounded-lg border border-teal-800/80">
              {clearStatus}
            </div>
          )}

          {memories.length === 0 ? (
            <p className="text-xs text-slate-500 italic">No saved preferences yet. Tell Anisa: "Remember that I prefer Bengali"</p>
          ) : (
            <div className="space-y-1.5 max-h-32 overflow-y-auto">
              {memories.map((m) => (
                <div key={m.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-950/70 border border-slate-800 text-xs">
                  <span className="font-mono text-cyan-300">{m.key}: <span className="text-slate-300">{String(m.value)}</span></span>
                  <button
                    onClick={() => handleForgetKey(m.key)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                    title="Forget this"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 5. Security Guarantee & About */}
        <div className="p-3 rounded-2xl bg-cyan-950/30 border border-cyan-800/40 text-xs text-cyan-300 flex items-start gap-2.5">
          <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold text-cyan-200">ANISA AI ULTRA Security Policy: </span>
            Zero arbitrary shell execution. No password or credential storage. Strict schema validation on all 33 registered tools.
          </div>
        </div>
      </div>
    </div>
  );
};
