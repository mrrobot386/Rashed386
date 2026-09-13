import { GoogleGenAI } from '@google/genai';
import { AssistantState, ToolCall } from '../types/assistant';
import { AudioStreamer } from '../audio/AudioStreamer';
import { AudioPlayer } from '../audio/AudioPlayer';
import { arrayBufferToBase64, base64ToArrayBuffer } from '../audio/pcmUtils';
import { LIVE_CONFIG } from './liveConfig';
import { ToolDispatcher } from './toolDispatcher';
import { AnisaError } from '../utils/errors';

export interface LiveSessionCallbacks {
  onStateChange: (state: AssistantState) => void;
  onAudioLevel?: (level: number) => void;
  onToolCall?: (toolName: string, message: string) => void;
  onError: (error: string) => void;
  onConnected: () => void;
  onDisconnected: () => void;
}

export class LiveSession {
  private state: AssistantState = 'disconnected';
  private streamer: AudioStreamer | null = null;
  private player: AudioPlayer | null = null;
  private session: any = null;
  private apiKey: string;

  constructor(
    apiKey: string,
    private callbacks: LiveSessionCallbacks
  ) {
    this.apiKey = apiKey;
  }

  private setState(newState: AssistantState) {
    this.state = newState;
    this.callbacks.onStateChange(newState);
  }

  async connect(): Promise<void> {
    if (this.state === 'connecting' || this.state === 'listening' || this.state === 'speaking') {
      return;
    }

    if (!this.apiKey || this.apiKey.includes('MY_GEMINI_API_KEY')) {
      this.setState('error');
      this.callbacks.onError('Gemini API key is missing. Please add your key to .env as VITE_GEMINI_API_KEY.');
      return;
    }

    try {
      this.setState('connecting');

      // Initialize Web Audio Player
      this.player = new AudioPlayer((isPlaying) => {
        if (this.state === 'speaking' && !isPlaying) {
          this.setState('listening');
        } else if (this.state === 'listening' && isPlaying) {
          this.setState('speaking');
        }
      });

      // Initialize Microphone Streamer with user-interruption detector
      this.streamer = new AudioStreamer(
        (pcm16Chunk) => {
          this.sendAudio(pcm16Chunk);
        },
        () => {
          // User started speaking while Anisa is talking -> interrupt!
          if (this.state === 'speaking') {
            this.interrupt();
          }
        }
      );

      // Connect to Google GenAI Live Session
      const ai = new GoogleGenAI({ apiKey: this.apiKey });
      const session = await ai.live.connect({
        model: LIVE_CONFIG.model,
        config: LIVE_CONFIG as any,
        callbacks: {
          onmessage: async (message: any) => {
            await this.handleServerMessage(message);
          },
          onerror: (err: any) => {
            if (this.state !== 'disconnected') {
              this.callbacks.onError(`Live session stream error: ${String(err)}`);
              this.disconnect();
            }
          },
          onclose: () => {
            if (this.state !== 'disconnected') {
              this.disconnect();
            }
          },
        },
      });

      this.session = session;

      // Start audio input stream
      await this.streamer.start();

      this.setState('listening');
      this.callbacks.onConnected();
    } catch (err: unknown) {
      this.cleanup();
      this.setState('error');
      const message = err instanceof AnisaError ? err.message : String(err || 'Failed to connect to Anisa Live session.');
      this.callbacks.onError(message);
    }
  }

  private async handleServerMessage(message: any) {
    try {
      // Handle server audio output chunks
      if (message.serverContent?.modelTurn?.parts) {
        for (const part of message.serverContent.modelTurn.parts) {
          if (part.inlineData?.data) {
            const audioBuffer = base64ToArrayBuffer(part.inlineData.data);
            this.player?.playChunk(audioBuffer);
          }
        }
      }

      // Handle tool calls
      if (message.toolCall?.functionCalls) {
        for (const call of message.toolCall.functionCalls) {
          const toolCall: ToolCall = {
            id: call.id || String(Date.now()),
            name: call.name,
            args: call.args || {},
          };
          this.callbacks.onToolCall?.(call.name, `Running ${call.name}...`);
          const response = await ToolDispatcher.dispatch(toolCall);
          await this.session?.sendToolResponse({
            functionResponses: [
              {
                id: response.id,
                name: response.name,
                response: response.response,
              },
            ],
          });
        }
      }

      // Handle model turn complete
      if (message.serverContent?.turnComplete) {
        // If no audio is currently queued, revert to listening
        if (!this.player?.getIsPlaying()) {
          this.setState('listening');
        }
      }

      // Handle interruption signal from Gemini
      if (message.serverContent?.interrupted) {
        this.player?.flush();
        this.setState('listening');
      }
    } catch (err: unknown) {
      if (this.state !== 'disconnected') {
        this.callbacks.onError(`Live session processing error: ${String(err)}`);
      }
    }
  }

  sendAudio(pcmChunk: ArrayBuffer): void {
    if (this.session && (this.state === 'listening' || this.state === 'speaking')) {
      const base64Audio = arrayBufferToBase64(pcmChunk);
      this.session.sendRealtimeInput({
        audio: {
          mimeType: 'audio/pcm;rate=16000',
          data: base64Audio,
        },
      });
    }
  }

  interrupt(): void {
    // Stop local playback instantly
    this.player?.flush();
    this.setState('listening');
  }

  disconnect(): void {
    this.cleanup();
    this.setState('disconnected');
    this.callbacks.onDisconnected();
  }

  private cleanup(): void {
    if (this.streamer) {
      this.streamer.stop();
      this.streamer = null;
    }
    if (this.player) {
      this.player.stop();
      this.player = null;
    }
    if (this.session) {
      try {
        this.session.close?.();
      } catch {
        // ignore close errors
      }
      this.session = null;
    }
  }

  getState(): AssistantState {
    return this.state;
  }
}
