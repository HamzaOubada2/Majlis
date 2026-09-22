export type UserRole = 'ADMIN' | 'ATTENDEE';
export type ReservationStatus = 'CONFIRMED' | 'CANCELLED';

export interface Scholar {
  id: string;
  name: string;
  bio: string | null;
  specialization: string | null;
  avatarUrl?: string | null;
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

export interface UserRecord {
  id: string;
  email: string;
  fullname?: string;
  fullName?: string;
  role: UserRole;
}

export interface AdminReservation {
  id: string;
  userId: string;
  seminarId: string;
  seminar: Seminar;
  user: UserRecord;
  status: ReservationStatus;
  createdAt: string;
}

export interface AdminOverview {
  totalUsers: number;
  totalScholars: number;
  totalSeminars: number;
  activeSeminars: number;
  endedSeminars: number;
  totalCapacity: number;
  totalAvailableSeats: number;
  totalBookedSeats: number;
  confirmedReservations: number;
  cancelledReservations: number;
  totalReservations: number;
  reservationPercentage: number;
}

export interface ScholarPayload {
  name: string;
  specialization?: string;
  bio?: string;
  avatarUrl?: string;
}

export interface SeminarPayload {
  title: string;
  description?: string;
  eventDate: string;
  location: string;
  capacity: number;
  scholarId?: string | null;
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