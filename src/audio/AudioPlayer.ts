/**
 * AudioPlayer plays streaming PCM chunks using the Web Audio API at 24kHz.
 * Supports instantaneous queue flushing when interrupted.
 */

export class AudioPlayer {
  private audioContext: AudioContext | null = null;
  private nextPlayTime = 0;
  private activeSources: AudioBufferSourceNode[] = [];
  private isPlaying = false;
  private onPlaybackStateChange?: (playing: boolean) => void;

  constructor(onPlaybackStateChange?: (playing: boolean) => void) {
    this.onPlaybackStateChange = onPlaybackStateChange;
  }

  private initContext(): AudioContext {
    if (!this.audioContext || this.audioContext.state === 'closed') {
      this.audioContext = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)({
        sampleRate: 24000,
        latencyHint: 'interactive',
      });
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume().catch(() => {});
    }
    return this.audioContext;
  }

  playChunk(pcmData: ArrayBuffer): void {
    const ctx = this.initContext();
    const int16Array = new Int16Array(pcmData);
    if (int16Array.length === 0) return;

    const float32Array = new Float32Array(int16Array.length);
    for (let i = 0; i < int16Array.length; i++) {
      float32Array[i] = int16Array[i] / 32768.0;
    }

    const audioBuffer = ctx.createBuffer(1, float32Array.length, 24000);
    audioBuffer.getChannelData(0).set(float32Array);

    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);

    const currentTime = ctx.currentTime;
    const startTime = Math.max(currentTime, this.nextPlayTime);
    source.start(startTime);
    this.nextPlayTime = startTime + audioBuffer.duration;

    this.activeSources.push(source);

    if (!this.isPlaying) {
      this.isPlaying = true;
      this.onPlaybackStateChange?.(true);
    }

    source.onended = () => {
      const idx = this.activeSources.indexOf(source);
      if (idx !== -1) {
        this.activeSources.splice(idx, 1);
      }
      if (this.activeSources.length === 0 && ctx.currentTime >= this.nextPlayTime - 0.05) {
        this.isPlaying = false;
        this.onPlaybackStateChange?.(false);
      }
    };
  }

  /**
   * Immediately stops all currently playing audio and flushes the queue on interruption.
   */
  flush(): void {
    for (const source of this.activeSources) {
      try {
        source.stop();
        source.disconnect();
      } catch {
        // Source might have finished already
      }
    }
    this.activeSources = [];
    if (this.audioContext) {
      this.nextPlayTime = this.audioContext.currentTime;
    } else {
      this.nextPlayTime = 0;
    }
    if (this.isPlaying) {
      this.isPlaying = false;
      this.onPlaybackStateChange?.(false);
    }
  }

  stop(): void {
    this.flush();
    if (this.audioContext) {
      this.audioContext.close().catch(() => {});
      this.audioContext = null;
    }
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }
}
