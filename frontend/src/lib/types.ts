export type UserRole = 'ADMIN' | 'ATTENDEE';
export type ReservationStatus = 'CONFIRMED' | 'CANCELLED';

export interface Scholar {
  id: string;
  name: string;
  bio: string | null;
  specialization: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Seminar {
  id: string;
  title: string;
  description: string | null;
  eventDate: string;
  location: string;
  capacity: number | string;
  scholar: Scholar | null;
  scholarId: string | null;
  availableSeats: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Reservation {
  id: string;
  userId: string;
  seminarId: string;
  seminar: Seminar;
  status: ReservationStatus;
  createdAt: string;
}

export interface AuthUser {
  id: string;
  email: string;
  fullname?: string;
  fullName?: string;
  role: UserRole;
  [key: string]: unknown;
}

export interface AuthResponse {
  user: AuthUser;
  access_token: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload extends AuthCredentials {
  fullName: string;
}