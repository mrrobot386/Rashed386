import { floatTo16BitPCM, resampleTo16kHZ } from './pcmUtils';
import { AnisaError } from '../utils/errors';

export type AudioDataCallback = (pcmData: ArrayBuffer) => void;
export type UserSpeechDetectedCallback = () => void;

export class AudioStreamer {
  private mediaStream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private processor: ScriptProcessorNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private isRecording = false;

  constructor(
    private onAudioData: AudioDataCallback,
    private onSpeechDetected?: UserSpeechDetectedCallback
  ) {}

  async start(): Promise<void> {
    if (this.isRecording) return;

    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      this.audioContext = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)({
        latencyHint: 'interactive',
      });

      this.source = this.audioContext.createMediaStreamSource(this.mediaStream);
      // Buffer size 2048 gives low latency chunks ~40-100ms
      this.processor = this.audioContext.createScriptProcessor(2048, 1, 1);

      this.processor.onaudioprocess = (e) => {
        if (!this.isRecording) return;
        const inputData = e.inputBuffer.getChannelData(0);

        // Simple speech energy threshold detector for live interruption
        let sumSquares = 0;
        for (let i = 0; i < inputData.length; i++) {
          sumSquares += inputData[i] * inputData[i];
        }
        const rms = Math.sqrt(sumSquares / inputData.length);
        if (rms > 0.04 && this.onSpeechDetected) {
          this.onSpeechDetected();
        }

        // Resample to 16kHz mono PCM
        const resampled = resampleTo16kHZ(inputData, e.inputBuffer.sampleRate);
        const pcm16 = floatTo16BitPCM(resampled);
        this.onAudioData(pcm16);
      };

      this.source.connect(this.processor);
      this.processor.connect(this.audioContext.destination);
      this.isRecording = true;
    } catch (err: unknown) {
      this.stop();
      if (err instanceof DOMException && err.name === 'NotAllowedError') {
        throw new AnisaError(
          'Microphone permission was denied. Please allow microphone access to talk to Anisa.',
          'MIC_PERMISSION_DENIED'
        );
      }
      throw new AnisaError(
        'Failed to access audio microphone.',
        'MIC_INIT_ERROR'
      );
    }
  }

  stop(): void {
    this.isRecording = false;

    if (this.processor) {
      this.processor.disconnect();
      this.processor = null;
    }
    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }
    if (this.audioContext) {
      this.audioContext.close().catch(() => {});
      this.audioContext = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
  }

  isActive(): boolean {
    return this.isRecording;
  }
}
