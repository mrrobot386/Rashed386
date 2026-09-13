/**
 * User Preferences Store for ANISA AI ULTRA
 * Safe local storage of approved personal preferences.
 */

import { UserPreferences } from '../types/memory';

const PREFERENCES_STORAGE_KEY = 'anisa_user_preferences_v1';

export const DEFAULT_PREFERENCES: UserPreferences = {
  preferredLanguage: 'auto',
  speakingSpeed: 1.0,
  responseLength: 'concise',
  presentationModeAutoStart: false,
  approvedFolders: ['Downloads', 'Documents', 'Desktop'],
  preferredApps: {
    browser: 'Chrome',
    mediaPlayer: 'Default',
    presentation: 'PowerPoint',
    chat: 'WhatsApp',
  },
  auditLoggingEnabled: true,
};

export class PreferencesManager {
  static getPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(PREFERENCES_STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
      }
    } catch {
      // Return defaults on parse or privacy restrictions
    }
    return { ...DEFAULT_PREFERENCES };
  }

  static savePreferences(preferences: Partial<UserPreferences>): UserPreferences {
    const current = this.getPreferences();
    const updated = { ...current, ...preferences };
    try {
      localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Safe fallback
    }
    return updated;
  }

  static resetPreferences(): UserPreferences {
    try {
      localStorage.removeItem(PREFERENCES_STORAGE_KEY);
    } catch {
      // Safe fallback
    }
    return { ...DEFAULT_PREFERENCES };
  }
}
