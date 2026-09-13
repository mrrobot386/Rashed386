/**
 * System and Device Type Definitions for ANISA AI ULTRA
 */

export interface DeviceVitals {
  battery?: {
    percent: number;
    charging: boolean;
  };
  cpuUsagePercent?: number;
  memoryUsagePercent?: number;
  storageUsagePercent?: number;
  uptimeSeconds?: number;
  networkSsid?: string;
  networkConnected?: boolean;
  activeApp?: string;
}

export interface ProcessItem {
  pid: number;
  name: string;
  cpuPercent?: number;
  memoryMb?: number;
}

export interface MediaState {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  volume: number;
  isMuted: boolean;
}

export interface PowerPointState {
  isRunning: boolean;
  currentSlide: number;
  totalSlides: number;
  presentationName?: string;
  isSlideshowActive: boolean;
}

export interface SystemHealthReport {
  gemini: 'connected' | 'connecting' | 'disconnected' | 'error';
  microphone: 'ready' | 'denied' | 'error' | 'uninitialized';
  audioOutput: 'ready' | 'error';
  systemAgent: 'connected' | 'offline';
  toolRegistry: 'ready' | 'degraded';
  network: 'online' | 'offline';
}
