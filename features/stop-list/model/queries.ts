import { useMutationState,useQuery } from '@tanstack/react-query';
import type { MenuItem } from '@/types/menu';

export const menuKeys = {
  all: ['menu-items'] as const,
  list: () => ['menu-items', 'list'] as const,
};

async function fetchMenuItems(): Promise<MenuItem[]> {
  const response = await fetch('/api/menu-items');
  if (!response.ok) {
    throw new Error('Не удалось загрузить меню');
  }
  return response.json();
}

export function useMenuItems() {
  return useQuery({
    queryKey: menuKeys.list(),
    queryFn: fetchMenuItems,
  });
}

export function usePendingMenuItemIds(): Set<string> {
  const pendingStopIds = useMutationState({
    filters: { mutationKey: ['stop-item'], status: 'pending' },
    select: (mutation) => (mutation.state.variables as { id: string } | undefined)?.id,
  });

  const pendingResumeIds = useMutationState({
    filters: { mutationKey: ['resume-item'], status: 'pending' },
    select: (mutation) => mutation.state.variables as string | undefined,
  });

  return new Set([...pendingStopIds, ...pendingResumeIds].filter((id): id is string => Boolean(id)));
}