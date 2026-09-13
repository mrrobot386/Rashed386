/**
 * Intent Engine for ANISA AI ULTRA
 * Recognizes intent across Bengali, English, Hindi, Banglish, and Hinglish.
 */

export type IntentCategory =
  | 'application_control'
  | 'whatsapp_messaging'
  | 'presentation_slides'
  | 'file_operation'
  | 'media_control'
  | 'system_vitals'
  | 'network_control'
  | 'vision_analysis'
  | 'security_lock'
  | 'daily_briefing'
  | 'preference_memory'
  | 'conversational';

export interface RecognizedIntent {
  category: IntentCategory;
  confidence: number;
  detectedLanguage: 'en' | 'bn' | 'hi' | 'mixed';
  entities: Record<string, string>;
  isDangerous: boolean;
  requiresConfirmation: boolean;
}

export class IntentEngine {
  /**
   * Pre-screens intent patterns to assist client-side validation and immediate feedback.
   */
  static analyze(utterance: string): RecognizedIntent {
    const text = utterance.trim().toLowerCase();

    // 1. WhatsApp / Messaging
    if (
      text.includes('whatsapp') ||
      text.includes('হোয়াটসঅ্যাপ') ||
      text.includes('মেসেজ') ||
      text.includes('chat') ||
      text.includes('संदेश')
    ) {
      const isSending = text.includes('send') || text.includes('পাঠাও') || text.includes('भेजो');
      return {
        category: 'whatsapp_messaging',
        confidence: 0.95,
        detectedLanguage: /[\u0980-\u09FF]/.test(text) ? 'bn' : /[\u0900-\u097F]/.test(text) ? 'hi' : 'en',
        entities: { action: isSending ? 'send' : 'prepare' },
        isDangerous: false,
        requiresConfirmation: isSending,
      };
    }

    // 2. PowerPoint / Presentation
    if (
      text.includes('slide') ||
      text.includes('slideshow') ||
      text.includes('presentation') ||
      text.includes('স্লাইড') ||
      text.includes('পাওয়ারপয়েন্ট') ||
      text.includes('powerpoint')
    ) {
      return {
        category: 'presentation_slides',
        confidence: 0.95,
        detectedLanguage: /[\u0980-\u09FF]/.test(text) ? 'bn' : 'en',
        entities: {},
        isDangerous: false,
        requiresConfirmation: false,
      };
    }

    // 3. Media control
    if (
      text.includes('music') ||
      text.includes('song') ||
      text.includes('pause') ||
      text.includes('গান') ||
      text.includes('play') ||
      text.includes('volume') ||
      text.includes('next song') ||
      text.includes('गाना')
    ) {
      return {
        category: 'media_control',
        confidence: 0.9,
        detectedLanguage: /[\u0980-\u09FF]/.test(text) ? 'bn' : 'en',
        entities: {},
        isDangerous: false,
        requiresConfirmation: false,
      };
    }

    // 4. File operations (delete/move are confirmation-required)
    if (
      text.includes('file') ||
      text.includes('folder') ||
      text.includes('delete') ||
      text.includes('move') ||
      text.includes('ফাইল') ||
      text.includes('ফোল্ডার') ||
      text.includes('মুছে')
    ) {
      const isDestructive = text.includes('delete') || text.includes('মুছে') || text.includes('remove');
      return {
        category: 'file_operation',
        confidence: 0.85,
        detectedLanguage: /[\u0980-\u09FF]/.test(text) ? 'bn' : 'en',
        entities: {},
        isDangerous: isDestructive,
        requiresConfirmation: isDestructive,
      };
    }

    // 5. System Lock
    if (text.includes('lock') || text.includes('লক')) {
      return {
        category: 'security_lock',
        confidence: 0.95,
        detectedLanguage: /[\u0980-\u09FF]/.test(text) ? 'bn' : 'en',
        entities: {},
        isDangerous: false,
        requiresConfirmation: false,
      };
    }

    // 6. Briefing / Device Status
    if (
      text.includes('briefing') ||
      text.includes('status') ||
      text.includes('battery') ||
      text.includes('ব্যাটারি') ||
      text.includes('device')
    ) {
      return {
        category: text.includes('briefing') ? 'daily_briefing' : 'system_vitals',
        confidence: 0.9,
        detectedLanguage: /[\u0980-\u09FF]/.test(text) ? 'bn' : 'en',
        entities: {},
        isDangerous: false,
        requiresConfirmation: false,
      };
    }

    // 7. Memory management
    if (
      text.includes('remember') ||
      text.includes('forget') ||
      text.includes('মনে রাখো') ||
      text.includes('ভুলে যাও')
    ) {
      return {
        category: 'preference_memory',
        confidence: 0.9,
        detectedLanguage: /[\u0980-\u09FF]/.test(text) ? 'bn' : 'en',
        entities: {},
        isDangerous: false,
        requiresConfirmation: false,
      };
    }

    // Default conversational
    return {
      category: 'conversational',
      confidence: 0.7,
      detectedLanguage: /[\u0980-\u09FF]/.test(text) ? 'bn' : /[\u0900-\u097F]/.test(text) ? 'hi' : 'en',
      entities: {},
      isDangerous: false,
      requiresConfirmation: false,
    };
  }
}
