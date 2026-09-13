/**
 * Voice Activity & Audio Detection Engine for ANISA AI ULTRA
 * Analyzes audio energy, detects speech boundaries, silence, and barge-in conditions.
 */

export interface AudioDetectorOptions {
  energyThreshold?: number; // RMS energy threshold
  silenceThresholdMs?: number; // Time of low energy to trigger silence/end
  speechHoldMs?: number; // Minimum speech duration to confirm speech onset
}

export class AudioDetector {
  private energyThreshold: number;
  private silenceThresholdMs: number;
  private speechHoldMs: number;

  private isSpeaking = false;
  private speechStartTime = 0;
  private lastHighEnergyTime = 0;

  private onSpeechStart?: () => void;
  private onSpeechEnd?: () => void;
  private onEnergyLevel?: (rms: number) => void;

  constructor(options: AudioDetectorOptions = {}) {
    this.energyThreshold = options.energyThreshold ?? 0.035;
    this.silenceThresholdMs = options.silenceThresholdMs ?? 600;
    this.speechHoldMs = options.speechHoldMs ?? 80;
  }

  setCallbacks(callbacks: {
    onSpeechStart?: () => void;
    onSpeechEnd?: () => void;
    onEnergyLevel?: (rms: number) => void;
  }): void {
    this.onSpeechStart = callbacks.onSpeechStart;
    this.onSpeechEnd = callbacks.onSpeechEnd;
    this.onEnergyLevel = callbacks.onEnergyLevel;
  }

  processAudioFrame(pcmData: Float32Array): number {
    let sumSquares = 0;
    for (let i = 0; i < pcmData.length; i++) {
      sumSquares += pcmData[i] * pcmData[i];
    }
    const rms = Math.sqrt(sumSquares / Math.max(1, pcmData.length));
    const now = Date.now();

    this.onEnergyLevel?.(rms);

    if (rms >= this.energyThreshold) {
      this.lastHighEnergyTime = now;
      if (!this.isSpeaking) {
        if (this.speechStartTime === 0) {
          this.speechStartTime = now;
        } else if (now - this.speechStartTime >= this.speechHoldMs) {
          this.isSpeaking = true;
          this.onSpeechStart?.();
        }
      }
    } else {
      if (this.isSpeaking) {
        if (now - this.lastHighEnergyTime >= this.silenceThresholdMs) {
          this.isSpeaking = false;
          this.speechStartTime = 0;
          this.onSpeechEnd?.();
        }
      } else {
        this.speechStartTime = 0;
      }
    }

    return rms;
  }

  getIsUserSpeaking(): boolean {
    return this.isSpeaking;
  }

  reset(): void {
    this.isSpeaking = false;
    this.speechStartTime = 0;
    this.lastHighEnergyTime = 0;
  }
}
