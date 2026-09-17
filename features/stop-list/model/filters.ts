import type { MenuItem, Shop } from '@/types/menu';

export type StatusFilter = 'available' | 'stopped';

export interface MenuFilters {
  shop: Shop | null;
  status: StatusFilter | null;
}

const SHOP_VALUES: Shop[] = ['kitchen', 'bar', 'pastry'];
const STATUS_VALUES: StatusFilter[] = ['available', 'stopped'];

export function parseFilters(searchParams: Record<string, string | string[] | undefined>): MenuFilters {
  const shopRaw = searchParams.shop;
  const statusRaw = searchParams.status;

  const shop = typeof shopRaw === 'string' && SHOP_VALUES.includes(shopRaw as Shop) ? (shopRaw as Shop) : null;
  const status =
    typeof statusRaw === 'string' && STATUS_VALUES.includes(statusRaw as StatusFilter)
      ? (statusRaw as StatusFilter)
      : null;

  return { shop, status };
}

export function filtersToSearchParams(filters: MenuFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.shop) params.set('shop', filters.shop);
  if (filters.status) params.set('status', filters.status);
  return params;
}

export function matchesFilters(item: MenuItem, filters: MenuFilters): boolean {
  if (filters.shop && item.shop !== filters.shop) return false;
  if (filters.status && item.status.kind !== filters.status) return false;
  return true;
}