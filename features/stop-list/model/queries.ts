import { useQuery } from '@tanstack/react-query';
import type { MenuItem } from '@/types/menu';

export const menuKeys = {
  all: ['menu-items'] as const,
  list: (filtersKey: unknown) => ['menu-items', 'list', filtersKey] as const,
};

async function fetchMenuItems(): Promise<MenuItem[]> {
  const response = await fetch('/api/menu-items');
  if (!response.ok) {
    throw new Error('Не удалось загрузить меню');
  }
  return response.json();
}

export function useMenuItems(filtersKey: unknown) {
  return useQuery({
    queryKey: menuKeys.list(filtersKey),
    queryFn: fetchMenuItems,
  });
}