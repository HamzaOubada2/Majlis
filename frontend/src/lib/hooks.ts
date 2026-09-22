'use client';

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query';
import { api, extractErrorMessage } from '@/lib/api';
import { useI18n } from '@/lib/i18n-provider';
import type {
  AdminOverview,
  AdminReservation,
  Reservation,
  Scholar,
  ScholarPayload,
  Seminar,
  SeminarPayload,
} from '@/lib/types';
import { toast } from 'sonner';

export const QK = {
  seminars: ['seminars'] as const,
  seminar: (id: string) => ['seminars', id] as const,
  scholars: ['scholars'] as const,
  myReservations: ['my-reservations'] as const,
  adminOverview: ['admin', 'overview'] as const,
  adminReservations: ['admin', 'reservations'] as const,
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

async function getAdminOverview(): Promise<AdminOverview> {
  const { data } = await api.get<AdminOverview>('/admin/overview');
  return data;
}

async function getAdminReservations(seminarId?: string): Promise<AdminReservation[]> {
  const { data } = await api.get<AdminReservation[]>('/admin/reservations', {
    params: seminarId ? { seminarId } : undefined,
  });
  return data;
}

export function useAdminOverview() {
  return useQuery({ queryKey: QK.adminOverview, queryFn: getAdminOverview });
}

export function useAdminReservations(seminarId?: string) {
  return useQuery({
    queryKey: [...QK.adminReservations, seminarId ?? 'all'],
    queryFn: () => getAdminReservations(seminarId),
    refetchInterval: 15_000,
  });
}

function invalidateAdmin(queryClient: ReturnType<typeof useQueryClient>) {
  void queryClient.invalidateQueries({ queryKey: QK.seminars });
  void queryClient.invalidateQueries({ queryKey: QK.scholars });
  void queryClient.invalidateQueries({ queryKey: QK.adminOverview });
  void queryClient.invalidateQueries({ queryKey: QK.adminReservations });
}

export function useCreateScholar() {
  const queryClient = useQueryClient();
  const { t } = useI18n();
  return useMutation({
    mutationFn: async (payload: ScholarPayload) => {
      const { data } = await api.post<Scholar>('/scholars', payload);
      return data;
    },
    onSuccess: () => {
      toast.success(t('admin.scholarCreated'));
      invalidateAdmin(queryClient);
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error, t));
    },
  });
}

export function useUpdateScholar() {
  const queryClient = useQueryClient();
  const { t } = useI18n();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: ScholarPayload }) => {
      const { data } = await api.patch<Scholar>(`/scholars/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      toast.success(t('admin.scholarUpdated'));
      invalidateAdmin(queryClient);
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error, t));
    },
  });
}

export function useDeleteScholar() {
  const queryClient = useQueryClient();
  const { t } = useI18n();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/scholars/${id}`);
    },
    onSuccess: () => {
      toast.success(t('admin.scholarDeleted'));
      invalidateAdmin(queryClient);
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error, t));
    },
  });
}

export function useCreateSeminar() {
  const queryClient = useQueryClient();
  const { t } = useI18n();
  return useMutation({
    mutationFn: async (payload: SeminarPayload) => {
      const { data } = await api.post<Seminar>('/seminars', payload);
      return data;
    },
    onSuccess: () => {
      toast.success(t('admin.seminarCreated'));
      invalidateAdmin(queryClient);
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error, t));
    },
  });
}

export function useUpdateSeminar() {
  const queryClient = useQueryClient();
  const { t } = useI18n();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: SeminarPayload }) => {
      const { data } = await api.patch<Seminar>(`/seminars/${id}`, payload);
      return data;
    },
    onSuccess: (_, { id }) => {
      toast.success(t('admin.seminarUpdated'));
      void queryClient.invalidateQueries({ queryKey: QK.seminar(id) });
      invalidateAdmin(queryClient);
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error, t));
    },
  });
}

export function useDeleteSeminar() {
  const queryClient = useQueryClient();
  const { t } = useI18n();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/seminars/${id}`);
    },
    onSuccess: () => {
      toast.success(t('admin.seminarDeleted'));
      invalidateAdmin(queryClient);
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error, t));
    },
  });
}