import { useMutation, useQueryClient } from '@tanstack/react-query';
import { menuKeys } from './queries';
import { useToastStore } from '@/shared/ui/toast-store';
import type { MenuItem, StopItemPayload } from '@/types/menu';

async function postStopMenuItem(id: string, payload: StopItemPayload): Promise<MenuItem> {
  const response = await fetch(`/api/menu-items/${id}/stop`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message ?? 'Не удалось поставить позицию в стоп-лист');
  }

  return response.json();
}

async function postResumeMenuItem(id: string): Promise<MenuItem> {
  const response = await fetch(`/api/menu-items/${id}/resume`, { method: 'POST' });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message ?? 'Не удалось вернуть позицию в продажу');
  }

  return response.json();
}

export function useStopItem() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);
  const listKey = menuKeys.list();

  return useMutation({
    mutationFn: (vars: { id: string; payload: StopItemPayload }) => postStopMenuItem(vars.id, vars.payload),

    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: listKey });
      const previousItems = queryClient.getQueryData<MenuItem[]>(listKey);

      queryClient.setQueryData<MenuItem[]>(listKey, (items = []) =>
        items.map((item) =>
          item.id === id
            ? { ...item, status: { kind: 'stopped', ...payload }, updatedAt: new Date().toISOString() }
            : item,
        ),
      );

      return { previousItems };
    },

    onError: (error, _vars, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(listKey, context.previousItems);
      }
      showToast(error instanceof Error ? error.message : 'Не удалось поставить позицию в стоп-лист');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: listKey });
    },
  });
}

export function useResumeItem() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);
  const listKey = menuKeys.list();

  return useMutation({
    mutationFn: (id: string) => postResumeMenuItem(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: listKey });
      const previousItems = queryClient.getQueryData<MenuItem[]>(listKey);

      queryClient.setQueryData<MenuItem[]>(listKey, (items = []) =>
        items.map((item) =>
          item.id === id ? { ...item, status: { kind: 'available' }, updatedAt: new Date().toISOString() } : item,
        ),
      );

      return { previousItems };
    },

    onError: (error, _id, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(listKey, context.previousItems);
      }
      showToast(error instanceof Error ? error.message : 'Не удалось вернуть позицию в продажу');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: listKey });
    },
  });
}