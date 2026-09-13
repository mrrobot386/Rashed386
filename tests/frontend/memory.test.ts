import { MemoryManager } from '../../src/memory/MemoryManager';

describe('MemoryManager', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('stores and retrieves approved user preferences', () => {
    const res = MemoryManager.remember('preference', 'language', 'bn');
    expect(res.success).toBe(true);

    const entries = MemoryManager.getEntries('preference');
    expect(entries.length).toBe(1);
    expect(entries[0].key).toBe('language');
    expect(entries[0].value).toBe('bn');
  });

  it('strictly rejects passwords and API keys', () => {
    const res1 = MemoryManager.remember('preference', 'my_password', 'secret123');
    expect(res1.success).toBe(false);
    expect(res1.message).toContain('prohibits');

    const res2 = MemoryManager.remember('preference', 'gemini_api_key', 'AIzaSy...');
    expect(res2.success).toBe(false);
  });

  it('forgets specific keys and clears all memory', () => {
    MemoryManager.remember('preference', 'theme', 'dark');
    expect(MemoryManager.getEntries().length).toBe(1);

    MemoryManager.forget('theme');
    expect(MemoryManager.getEntries().length).toBe(0);

    MemoryManager.remember('preference', 'folder', 'HSC');
    MemoryManager.clearAll();
    expect(MemoryManager.getEntries().length).toBe(0);
  });
});
