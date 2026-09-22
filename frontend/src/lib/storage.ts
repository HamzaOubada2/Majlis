const TOKEN_KEY = 'majlis_token';
const USER_KEY = 'majlis_user';
export const AUTH_EVENT = 'majlis:auth';

function isBrowser() {
  return typeof window !== 'undefined';
}

export const authStorage = {
  getToken(): string | null {
    if (!isBrowser()) return null;
    return window.localStorage.getItem(TOKEN_KEY);
  },
  getUser(): Record<string, unknown> | null {
    if (!isBrowser()) return null;
    try {
      const raw = window.localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  set(token: string, user: Record<string, unknown>) {
    if (!isBrowser()) return;
    window.localStorage.setItem(TOKEN_KEY, token);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
    window.dispatchEvent(new Event(AUTH_EVENT));
  },
  clear() {
    if (!isBrowser()) return;
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
    window.dispatchEvent(new Event(AUTH_EVENT));
  },
};

export function notifyAuthChanged() {
  if (isBrowser()) window.dispatchEvent(new Event(AUTH_EVENT));
}