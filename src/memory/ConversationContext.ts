/**
 * Session Context & Short-term Conversation Memory for ANISA AI ULTRA
 * Holds turn history and active entities in memory during current voice session only.
 */

import { ConversationTurn } from '../types/memory';

export class ConversationContext {
  private turns: ConversationTurn[] = [];
  private activeTopic: string | null = null;
  private lastIdentifiedEntities: Record<string, string> = {};

  addTurn(speaker: 'user' | 'assistant', content: string, intent?: string): void {
    const turn: ConversationTurn = {
      id: `turn_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      speaker,
      timestamp: Date.now(),
      content,
      intent,
    };
    this.turns.push(turn);
    if (this.turns.length > 50) {
      this.turns.shift();
    }
  }

  getRecentTurns(count = 6): ConversationTurn[] {
    return this.turns.slice(-count);
  }

  setActiveTopic(topic: string | null): void {
    this.activeTopic = topic;
  }

  getActiveTopic(): string | null {
    return this.activeTopic;
  }

  setEntity(key: string, value: string): void {
    this.lastIdentifiedEntities[key] = value;
  }

  getEntity(key: string): string | undefined {
    return this.lastIdentifiedEntities[key];
  }

  clear(): void {
    this.turns = [];
    this.activeTopic = null;
    this.lastIdentifiedEntities = {};
  }
}

export const conversationContext = new ConversationContext();
