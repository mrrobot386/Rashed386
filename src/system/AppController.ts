/**
 * Application Controller for ANISA AI ULTRA
 * Dispatches application lifecycle commands to the system agent with safe browser fallback.
 */

import { systemAgentClient } from './SystemAgentClient';

export interface AppLaunchResult {
  success: boolean;
  message?: string;
  error?: string;
  app?: string;
  mode?: 'native' | 'web_fallback';
}

export class AppController {
  static async launch(appName: string): Promise<AppLaunchResult> {
    const cleanName = appName.trim().toLowerCase();

    // Check system agent execution first
    const res = await systemAgentClient.executeTool('launchApplication', { app_name: cleanName });
    if (res.success) {
      return {
        success: true,
        app: cleanName,
        mode: 'native',
        message: res.message || `Launched ${appName}.`,
      };
    }

    // Safe browser web fallback if system service is offline
    if (cleanName.includes('whatsapp')) {
      window.open('https://web.whatsapp.com', '_blank', 'noopener,noreferrer');
      return {
        success: true,
        app: 'WhatsApp',
        mode: 'web_fallback',
        message: 'Opened WhatsApp Web in your browser.',
      };
    } else if (cleanName.includes('chrome') || cleanName.includes('browser')) {
      window.open('https://www.google.com', '_blank', 'noopener,noreferrer');
      return {
        success: true,
        app: 'Chrome',
        mode: 'web_fallback',
        message: 'Opened browser tab.',
      };
    } else if (cleanName.includes('youtube')) {
      window.open('https://www.youtube.com', '_blank', 'noopener,noreferrer');
      return {
        success: true,
        app: 'YouTube',
        mode: 'web_fallback',
        message: 'Opened YouTube.',
      };
    }

    return {
      success: false,
      app: cleanName,
      error: res.error || `Could not launch ${appName}.`,
    };
  }

  static async close(appName: string, userConfirmed = false): Promise<AppLaunchResult> {
    const res = await systemAgentClient.executeTool('closeApplication', {
      app_name: appName,
      user_confirmed: userConfirmed,
    });
    return {
      success: res.success,
      app: appName,
      message: res.message,
      error: res.error,
    };
  }

  static async detect(appName: string): Promise<{ running: boolean; message?: string }> {
    const res = await systemAgentClient.executeTool('detectApplication', { app_name: appName });
    return {
      running: Boolean(res.running),
      message: res.message,
    };
  }
}
