/**
 * Memory Type Definitions for ANISA AI ULTRA
 * Privacy-first: strictly prevents storing passwords, tokens, API keys, or biometrics.
 */

export type MemoryCategory = 'session' | 'preference' | 'task';

export interface MemoryEntry {
  id: string;
  category: MemoryCategory;
  key: string;
  value: string | number | boolean | string[];
  createdAt: number;
  updatedAt: number;
  userApproved: boolean;
}

export interface UserPreferences {
  preferredLanguage: 'auto' | 'en' | 'bn' | 'hi';
  speakingSpeed: number; // 0.8 - 1.2
  responseLength: 'concise' | 'balanced' | 'detailed';
  presentationModeAutoStart: boolean;
  approvedFolders: string[];
  preferredApps: {
    browser: string;
    mediaPlayer: string;
    presentation: string;
    chat: string;
  };
  auditLoggingEnabled: boolean;
}

export interface ConversationTurn {
  id: string;
  speaker: 'user' | 'assistant';
  timestamp: number;
  content: string;
  languageDetected?: string;
  intent?: string;
  toolInvocations?: string[];
}
