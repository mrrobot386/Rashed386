import { useState, useEffect, useRef, useCallback } from 'react';
import { AssistantState, SystemAgentStatus } from '../types/assistant';
import { LiveSession } from '../live/LiveSession';
import { systemAgentClient } from '../system/SystemAgentClient';

export function useAnisaLive() {
  const [state, setState] = useState<AssistantState>('disconnected');
  const [error, setError] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [systemStatus, setSystemStatus] = useState<SystemAgentStatus>({ connected: false });

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
    const interval = setInterval(checkAgent, 10000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const connect = useCallback(async () => {
    setError(null);
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

    const session = new LiveSession(apiKey, {
      onStateChange: (newState) => setState(newState),
      onToolCall: (name) => {
        setActiveTool(name);
        setTimeout(() => setActiveTool(null), 3000);
      },
      onError: (err) => setError(err),
      onConnected: () => setError(null),
      onDisconnected: () => {
        setActiveTool(null);
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
  }, []);

  const toggleSession = useCallback(() => {
    if (state === 'listening' || state === 'speaking' || state === 'connecting') {
      disconnect();
    } else {
      connect();
    }
  }, [state, connect, disconnect]);

  useEffect(() => {
    return () => {
      sessionRef.current?.disconnect();
    };
  }, []);

  return {
    state,
    error,
    activeTool,
    systemStatus,
    toggleSession,
    connect,
    disconnect,
  };
}
