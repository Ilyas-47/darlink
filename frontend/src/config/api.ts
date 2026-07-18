export const API_BASE =
  (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:5000/api';

const TOKEN_KEY = 'darlink_token';
const USER_KEY = 'darlink_user';

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthSession(token: string, user: unknown) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getImageUrl(url: string | undefined): string {
  if (!url) return 'https://via.placeholder.com/800x600?text=No+Image';
  if (url.startsWith('http')) return url;
  
  const base = API_BASE.replace(/\/api$/, '');
  return `${base}${url.startsWith('/') ? '' : '/'}${url}`;
}

export function getStoredUser(): {
  id: number;
  nom: string;
  email: string;
  role: string;
} | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function authHeaders(): HeadersInit {
  const t = getAuthToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (t) headers.Authorization = `Bearer ${t}`;
  return headers;
}
