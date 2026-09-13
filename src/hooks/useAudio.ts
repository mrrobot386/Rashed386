import { useState, useEffect, useCallback } from 'react';

export function useAudio() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.mediaDevices?.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices()
        .then((devices) => {
          const hasMic = devices.some((d) => d.kind === 'audioinput');
          setHasPermission(hasMic);
        })
        .catch(() => {
          setHasPermission(false);
        });
    }
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((t) => t.stop());
      setHasPermission(true);
      return true;
    } catch {
      setHasPermission(false);
      return false;
    }
  }, []);

  return {
    hasPermission,
    audioLevel,
    setAudioLevel,
    requestPermission,
  };
}
