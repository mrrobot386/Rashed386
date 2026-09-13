const FORBIDDEN_PROTOCOLS = [
  'javascript:',
  'data:',
  'file:',
  'vbscript:',
  'blob:',
];

export function isValidUrl(urlString: string): boolean {
  if (!urlString || typeof urlString !== 'string') {
    return false;
  }

  const trimmed = urlString.trim().toLowerCase();
  for (const forbidden of FORBIDDEN_PROTOCOLS) {
    if (trimmed.startsWith(forbidden)) {
      return false;
    }
  }

  try {
    const url = new URL(urlString.trim());
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}
