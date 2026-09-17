import { useQuery } from '@tanstack/react-query';
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