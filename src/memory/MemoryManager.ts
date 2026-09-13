/**
 * Privacy-Centric Memory Manager for ANISA AI ULTRA
 * Strictly rejects storing passwords, secret keys, biometrics, or authentication credentials.
 */

import { MemoryEntry, MemoryCategory } from '../types/memory';
import { PreferencesManager } from './Preferences';
import { conversationContext } from './ConversationContext';

const MEMORY_STORAGE_KEY = 'anisa_memory_entries_v1';

// Strict blacklist of prohibited terms
const SENSITIVE_KEY_PATTERNS = [
  /password/i,
  /passwd/i,
  /passcode/i,
  /secret/i,
  /api[_-]?key/i,
  /token/i,
  /credential/i,
  /biometric/i,
  /fingerprint/i,
  /faceid/i,
  /auth/i,
  /pin/i,
];

export class MemoryManager {
  private static isSensitiveKey(key: string, value: string): boolean {
    return (
      SENSITIVE_KEY_PATTERNS.some((p) => p.test(key)) ||
      SENSITIVE_KEY_PATTERNS.some((p) => p.test(value))
    );
  }

  static getEntries(category?: MemoryCategory): MemoryEntry[] {
    try {
      const raw = localStorage.getItem(MEMORY_STORAGE_KEY);
      if (!raw) return [];
      const entries: MemoryEntry[] = JSON.parse(raw);
      if (category) {
        return entries.filter((e) => e.category === category);
      }
      return entries;
    } catch {
      return [];
    }
  }

  static remember(
    category: MemoryCategory,
    key: string,
    value: string | number | boolean | string[],
    userApproved = true
  ): { success: boolean; message: string } {
    const stringVal = String(value);
    if (this.isSensitiveKey(key, stringVal)) {
      return {
        success: false,
        message: 'ANISA AI strictly prohibits storing passwords, credentials, or biometric data.',
      };
    }

    const entries = this.getEntries();
    const existingIdx = entries.findIndex((e) => e.key.toLowerCase() === key.toLowerCase());

    const now = Date.now();
    if (existingIdx !== -1) {
      entries[existingIdx].value = value;
      entries[existingIdx].updatedAt = now;
      entries[existingIdx].userApproved = userApproved;
    } else {
      entries.push({
        id: `mem_${now}_${Math.random().toString(36).substring(2, 6)}`,
        category,
        key,
        value,
        createdAt: now,
        updatedAt: now,
        userApproved,
      });
    }

    try {
      localStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(entries));
      return {
        success: true,
        message: `Remembered "${key}": "${stringVal}".`,
      };
    } catch {
      return {
        success: false,
        message: 'Could not store memory entry.',
      };
    }
  }

  static forget(key: string): { success: boolean; message: string } {
    const entries = this.getEntries();
    const filtered = entries.filter((e) => e.key.toLowerCase() !== key.toLowerCase());

    if (filtered.length === entries.length) {
      return {
        success: false,
        message: `No saved memory found for "${key}".`,
      };
    }

    try {
      localStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(filtered));
      return {
        success: true,
        message: `I have forgotten "${key}".`,
      };
    } catch {
      return {
        success: false,
        message: 'Failed to update memory store.',
      };
    }
  }

  static clearAll(): { success: boolean; message: string } {
    try {
      localStorage.removeItem(MEMORY_STORAGE_KEY);
      PreferencesManager.resetPreferences();
      conversationContext.clear();
      return {
        success: true,
        message: 'All saved preferences and memories have been wiped clean.',
      };
    } catch {
      return {
        success: false,
        message: 'Failed to clear memory.',
      };
    }
  }
}
