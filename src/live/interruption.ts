/**
 * Interruption Manager for ANISA AI ULTRA
 * Coordinates instantaneous playback halt, queue flush, and session notification.
 */

export interface InterruptionHandler {
  onInterrupt: () => void;
}

export class InterruptionManager {
  private isInterrupted = false;
  private listeners: Array<() => void> = [];

  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  triggerBargeIn(): void {
    this.isInterrupted = true;
    for (const listener of this.listeners) {
      try {
        listener();
      } catch (err) {
        console.error('Error executing interruption listener', err);
      }
    }
  }

  reset(): void {
    this.isInterrupted = false;
  }

  getWasInterrupted(): boolean {
    return this.isInterrupted;
  }
}

export const interruptionManager = new InterruptionManager();
