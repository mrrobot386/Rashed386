/**
 * Device Controller for ANISA AI ULTRA
 * Interfaces with system vitals, battery status, native OS lock, and media playback.
 */

import { systemAgentClient } from './SystemAgentClient';
import { DeviceVitals } from '../types/system';

export class DeviceController {
  static async getVitals(): Promise<DeviceVitals> {
    const res = await systemAgentClient.executeTool('getDeviceStatus', {});
    if (res.success && res.device) {
      const dev = res.device as Record<string, unknown>;
      return {
        battery: dev.battery as { percent: number; charging: boolean } | undefined,
        cpuUsagePercent: dev.cpu_percent as number | undefined,
        memoryUsagePercent: dev.memory_percent as number | undefined,
        storageUsagePercent: dev.storage_percent as number | undefined,
        uptimeSeconds: dev.uptime_seconds as number | undefined,
        networkSsid: (dev.network as Record<string, unknown>)?.ssid as string | undefined,
        networkConnected: (dev.network as Record<string, unknown>)?.connected as boolean | undefined,
        activeApp: dev.active_app as string | undefined,
      };
    }
    return {};
  }

  static async lock(): Promise<{ success: boolean; message: string }> {
    const res = await systemAgentClient.executeTool('lockSystem', {});
    return {
      success: res.success,
      message: res.message || (res.success ? 'System locked.' : 'Failed to lock system.'),
    };
  }

  static async media(action: string): Promise<{ success: boolean; message: string }> {
    const res = await systemAgentClient.executeTool('mediaControl', { action });
    return {
      success: res.success,
      message: res.message || `Media control: ${action}`,
    };
  }
}
