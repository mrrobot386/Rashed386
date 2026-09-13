import { useState, useEffect, useCallback } from 'react';
import { systemAgentClient } from '../system/SystemAgentClient';
import { SystemAgentStatus } from '../types/assistant';
import { DeviceVitals } from '../types/system';

export function useSystemAgent(pollingIntervalMs = 10000) {
  const [status, setStatus] = useState<SystemAgentStatus>({ connected: false });
  const [vitals, setVitals] = useState<DeviceVitals | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkStatus = useCallback(async () => {
    setIsChecking(true);
    const s = await systemAgentClient.checkStatus();
    setStatus(s);
    if (s.connected) {
      const res = await systemAgentClient.executeTool('getDeviceStatus', {});
      if (res.success && res.device) {
        setVitals(res.device as DeviceVitals);
      }
    } else {
      setVitals(null);
    }
    setIsChecking(false);
  }, []);

  useEffect(() => {
    checkStatus();
    const timer = setInterval(checkStatus, pollingIntervalMs);
    return () => clearInterval(timer);
  }, [checkStatus, pollingIntervalMs]);

  return {
    status,
    vitals,
    isChecking,
    checkStatus,
  };
}
