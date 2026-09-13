import { isValidUrl } from '../../src/utils/urlValidation';

describe('urlValidation', () => {
  it('allows safe HTTPS and HTTP URLs', () => {
    expect(isValidUrl('https://www.youtube.com')).toBe(true);
    expect(isValidUrl('http://localhost:8765')).toBe(true);
    expect(isValidUrl('https://web.whatsapp.com')).toBe(true);
  });

  it('rejects forbidden protocols', () => {
    expect(isValidUrl('javascript:alert(1)')).toBe(false);
    expect(isValidUrl('data:text/html,test')).toBe(false);
    expect(isValidUrl('file:///etc/passwd')).toBe(false);
    expect(isValidUrl('vbscript:msgbox(1)')).toBe(false);
    expect(isValidUrl('blob:https://example.com')).toBe(false);
  });

  it('rejects malformed URLs or non-string inputs', () => {
    expect(isValidUrl('')).toBe(false);
    expect(isValidUrl('not-a-valid-url')).toBe(false);
  });
});
