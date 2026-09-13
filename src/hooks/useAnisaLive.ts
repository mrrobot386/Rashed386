import { useState, useEffect, useRef, useCallback } from 'react';
import { AssistantState, SystemAgentStatus } from '../types/assistant';
import { LiveSession } from '../live/LiveSession';
import { systemAgentClient } from '../system/SystemAgentClient';

export interface PendingConfirmation {
  tool: string;
  action?: string;
  description: string;
  args?: Record<string, unknown>;
}

export function useAnisaLive() {
  const [state, setState] = useState<AssistantState>('disconnected');
  const [error, setError] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [verificationMessage, setVerificationMessage] = useState<string | null>(null);
  const [systemStatus, setSystemStatus] = useState<SystemAgentStatus>({ connected: false });
  const [presentationMode, setPresentationMode] = useState<boolean>(false);
  const [micPermissionReady, setMicPermissionReady] = useState<boolean>(false);
  const [pendingConfirmation, setPendingConfirmation] = useState<PendingConfirmation | null>(null);

  const sessionRef = useRef<LiveSession | null>(null);

  // Poll system agent status periodically
  useEffect(() => {
    let mounted = true;
    const checkAgent = async () => {
      const status = await systemAgentClient.checkStatus();
      if (mounted) {
        setSystemStatus(status);
      }
    };
    checkAgent();
    const interval = setInterval(checkAgent, 8000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  // Check microphone permissions
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.mediaDevices?.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        const hasMic = devices.some((d) => d.kind === 'audioinput');
        setMicPermissionReady(hasMic);
      }).catch(() => {
        setMicPermissionReady(false);
      });
    }
  }, []);

  const connect = useCallback(async () => {
    setError(null);
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

    const session = new LiveSession(apiKey, {
      onStateChange: (newState) => setState(newState),
      onToolCall: (name, message) => {
        setActiveTool(name);
        setVerificationMessage(message || null);
        setTimeout(() => {
          setActiveTool((curr) => (curr === name ? null : curr));
        }, 3500);
      },
      onError: (err) => setError(err),
      onConnected: () => {
        setError(null);
        setMicPermissionReady(true);
      },
      onDisconnected: () => {
        setActiveTool(null);
        setVerificationMessage(null);
      },
    });

    sessionRef.current = session;
    await session.connect();
  }, []);

  const disconnect = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.disconnect();
      sessionRef.current = null;
    }
    setState('disconnected');
    setActiveTool(null);
    setVerificationMessage(null);
  }, []);

  const reconnect = useCallback(async () => {
    disconnect();
    await new Promise((resolve) => setTimeout(resolve, 300));
    await connect();
  }, [disconnect, connect]);

  const emergencyStop = useCallback(() => {
    if (sessionRef.current) {
      try {
        sessionRef.current.stop();
        sessionRef.current.disconnect();
      } catch {
        // Safe failover
      }
      sessionRef.current = null;
    }
    setState('disconnected');
    setActiveTool(null);
    setVerificationMessage(null);
    setError(null);
    setPendingConfirmation(null);
  }, []);

  const confirmPendingAction = useCallback(async () => {
    if (!pendingConfirmation) return;
    const { tool, args } = pendingConfirmation;
    setPendingConfirmation(null);
    setActiveTool(tool);
    try {
      const res = await systemAgentClient.executeTool(tool, {
        ...(args || {}),
        user_confirmed: true,
      });
      setVerificationMessage(res.message || 'Action executed with confirmation.');
      setTimeout(() => setVerificationMessage(null), 3500);
    } catch (e) {
      setError(`Failed to execute approved action: ${String(e)}`);
    } finally {
      setActiveTool(null);
    }
  }, [pendingConfirmation]);

  const cancelPendingAction = useCallback(() => {
    setPendingConfirmation(null);
  }, []);

  const toggleSession = useCallback(() => {
    if (state === 'listening' || state === 'speaking' || state === 'connecting') {
      disconnect();
    } else {
      connect();
    }
  }, [state, connect, disconnect]);

  const togglePresentationMode = useCallback(() => {
    setPresentationMode((prev) => !prev);
  }, []);

  useEffect(() => {
    return () => {
      sessionRef.current?.disconnect();
    };
  }, []);

  return {
    state,
    error,
    activeTool,
    verificationMessage,
    systemStatus,
    presentationMode,
    micPermissionReady,
    pendingConfirmation,
    setPendingConfirmation,
    confirmPendingAction,
    cancelPendingAction,
    toggleSession,
    connect,
    disconnect,
    reconnect,
    emergencyStop,
    togglePresentationMode,
  };
}
