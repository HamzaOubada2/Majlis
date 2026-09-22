'use client';

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query';
import { api, extractErrorMessage } from '@/lib/api';
import { useI18n } from '@/lib/i18n-provider';
import type { Reservation, Scholar, Seminar } from '@/lib/types';
import { toast } from 'sonner';

export const QK = {
  seminars: ['seminars'] as const,
  seminar: (id: string) => ['seminars', id] as const,
  scholars: ['scholars'] as const,
  myReservations: ['my-reservations'] as const,
};

async function getSeminars(): Promise<Seminar[]> {
  const { data } = await api.get<Seminar[]>('/seminars');
  return data;
}

async function getSeminar(id: string): Promise<Seminar> {
  const { data } = await api.get<Seminar>(`/seminars/${id}`);
  return data;
}

async function getScholars(): Promise<Scholar[]> {
  const { data } = await api.get<Scholar[]>('/scholars');
  return data;
}

async function getMyReservations(): Promise<Reservation[]> {
  const { data } = await api.get<Reservation[]>('/reservations/my-reservations');
  return data;
}

export function useSeminars(
  options?: Partial<UseQueryOptions<Seminar[]>>,
) {
  return useQuery({
    queryKey: QK.seminars,
    queryFn: getSeminars,
    staleTime: 30_000,
    ...options,
  });
}

export function useSeminar(id: string) {
  return useQuery({
    queryKey: QK.seminar(id),
    queryFn: () => getSeminar(id),
    enabled: Boolean(id),
  });
}

export function useScholars() {
  return useQuery({ queryKey: QK.scholars, queryFn: getScholars });
}

export function useMyReservations(enabled = true) {
  return useQuery({
    queryKey: QK.myReservations,
    queryFn: getMyReservations,
    enabled,
  });
}

export function useBookSeat() {
  const queryClient = useQueryClient();
  const { t } = useI18n();
  return useMutation({
    mutationFn: async (seminarId: string) => {
      const { data } = await api.post<Reservation>('/reservations', { seminarId });
      return data;
    },
    onSuccess: (data, seminarId) => {
      toast.success(t('booking.confirmed'));
      void queryClient.invalidateQueries({ queryKey: QK.seminars });
      void queryClient.invalidateQueries({ queryKey: QK.seminar(seminarId) });
      void queryClient.invalidateQueries({ queryKey: QK.myReservations });
      if (data.seminar) {
        void queryClient.invalidateQueries({ queryKey: QK.seminar(data.seminar.id) });
      }
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error, t));
    },
  });
}

export function useCancelReservation() {
  const queryClient = useQueryClient();
  const { t } = useI18n();
  return useMutation({
    mutationFn: async (reservationId: string) => {
      const { data } = await api.delete<{ message: string }>(
        `/reservations/${reservationId}`,
      );
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message || t('booking.cancelled'));
      void queryClient.invalidateQueries({ queryKey: QK.myReservations });
      void queryClient.invalidateQueries({ queryKey: QK.seminars });
      void queryClient.invalidateQueries({ queryKey: QK.scholars });
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error, t));
    },
  });
}