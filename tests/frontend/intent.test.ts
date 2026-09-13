import { IntentEngine } from '../../src/intelligence/IntentEngine';

describe('IntentEngine', () => {
  it('detects Bengali and mixed Banglish messaging intents', () => {
    const res1 = IntentEngine.analyze('Anisa, WhatsApp খুলে দাও');
    expect(res1.category).toBe('whatsapp_messaging');

    const res2 = IntentEngine.analyze('রাহিমকে মেসেজ পাঠাও');
    expect(res2.category).toBe('whatsapp_messaging');
    expect(res2.requiresConfirmation).toBe(true);
  });

  it('detects presentation commands', () => {
    const res = IntentEngine.analyze('আমার presentationটা খুঁজে slideshow চালাও');
    expect(res.category).toBe('presentation_slides');
  });

  it('detects media control commands', () => {
    const res = IntentEngine.analyze('Music pause করো');
    expect(res.category).toBe('media_control');
  });

  it('marks destructive file deletion as requiring confirmation', () => {
    const res = IntentEngine.analyze('এই ফোল্ডারটি delete করো');
    expect(res.category).toBe('file_operation');
    expect(res.requiresConfirmation).toBe(true);
  });
});
