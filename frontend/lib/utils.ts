export function cn(...parts: Array<string | false | undefined | null>) {
  return parts.filter(Boolean).join(' ');
}

export function truncate(text: string, len = 120) {
  if (text.length <= len) return text;
  return text.slice(0, len - 1) + '…';
}

// Auth token helpers (client-side)
const TOKEN_KEY = 'cms_token';

export function saveToken(token: string) {
  if (typeof window !== 'undefined') localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  if (typeof window !== 'undefined') localStorage.removeItem(TOKEN_KEY);
}

export function isLoggedIn() {
  return !!getToken();
}
