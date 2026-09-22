import type { AuthUser, Seminar } from './types';

export function isUpcoming(iso: string | Date): boolean {
  return new Date(iso).getTime() > Date.now();
}

export function getInitials(name?: string | null): string {
  if (!name) return '؟';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2);
  return (parts[0][0] ?? '') + (parts[1][0] ?? '');
}

export function getUserName(user?: AuthUser | null): string {
  if (!user) return '';
  const n = user.fullname ?? user.fullName ?? '';
  return n.toString();
}

export function getUserInitials(user?: AuthUser | null): string {
  return getInitials(getUserName(user));
}

export function normalizeCapacity(value: number | string | undefined): number {
  if (value == null) return 0;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export function bookedSeatsCount(seminar: Seminar): number {
  return Math.max(0, normalizeCapacity(seminar.capacity) - Number(seminar.availableSeats));
}

export function bookableProgress(seminar: Seminar): number {
  const capacity = normalizeCapacity(seminar.capacity);
  if (capacity <= 0) return 0;
  return Math.min(100, Math.round((Number(seminar.availableSeats) / capacity) * 100));
}

export function timeUntil(iso: string | Date): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  finished: boolean;
} {
  const diff = Math.max(0, new Date(iso).getTime() - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86_400),
    hours: Math.floor((totalSeconds % 86_400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    finished: diff === 0,
  };
}