import type { MenuItem, MenuItemStatus, Shop, StopItemPayload } from '@/types/menu';

type SeedRow = {
  title: string;
  shop: Shop;
  stock: number;
  status: MenuItemStatus;
};

function hoursFromNow(hours: number): string {
  return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
}

const seed: SeedRow[] = [
  { title: 'Борщ', shop: 'kitchen', stock: 12, status: { kind: 'available' } },
  { title: 'Стейк из говядины', shop: 'kitchen', stock: 0, status: { kind: 'stopped', reason: 'out_of_stock', until: null } },
  { title: 'Паста Карбонара', shop: 'kitchen', stock: 8, status: { kind: 'available' } },
  { title: 'Гриль на мангале', shop: 'kitchen', stock: 3, status: { kind: 'stopped', reason: 'equipment', until: hoursFromNow(2) } },
  { title: 'Салат Цезарь', shop: 'kitchen', stock: 15, status: { kind: 'available' } },
  { title: 'Утка confit', shop: 'kitchen', stock: 5, status: { kind: 'available' } },
  { title: 'Мохито', shop: 'bar', stock: 20, status: { kind: 'available' } },
  { title: 'Апероль Шпритц', shop: 'bar', stock: 0, status: { kind: 'stopped', reason: 'out_of_stock', until: null } },
  { title: 'Лимонад домашний', shop: 'bar', stock: 25, status: { kind: 'available' } },
  { title: 'Кофе на кофемашине', shop: 'bar', stock: 40, status: { kind: 'stopped', reason: 'equipment', until: hoursFromNow(4) } },
  { title: 'Тирамису', shop: 'pastry', stock: 6, status: { kind: 'available' } },
  { title: 'Чизкейк Нью-Йорк', shop: 'pastry', stock: 0, status: { kind: 'stopped', reason: 'quality', until: null } },
  { title: 'Круассан с миндалём', shop: 'pastry', stock: 10, status: { kind: 'available' } },
  { title: 'Медовик', shop: 'pastry', stock: 4, status: { kind: 'stopped', reason: 'menu_change', until: null } },
];

let items: MenuItem[] = seed.map((row, index) => ({
  id: String(index + 1),
  title: row.title,
  shop: row.shop,
  stock: row.stock,
  status: row.status,
  updatedAt: new Date().toISOString(),
}));

export function getMenuItems(): MenuItem[] {
  return items;
}

export function getMenuItem(id: string): MenuItem | undefined {
  return items.find((item) => item.id === id);
}

export function stopMenuItem(id: string, payload: StopItemPayload): MenuItem | undefined {
  const item = getMenuItem(id);
  if (!item) return undefined;

  const updated: MenuItem = {
    ...item,
    status: { kind: 'stopped', reason: payload.reason, until: payload.until },
    updatedAt: new Date().toISOString(),
  };
  items = items.map((existing) => (existing.id === id ? updated : existing));
  return updated;
}

export function resumeMenuItem(id: string): MenuItem | undefined {
  const item = getMenuItem(id);
  if (!item) return undefined;

  const updated: MenuItem = {
    ...item,
    status: { kind: 'available' },
    updatedAt: new Date().toISOString(),
  };
  items = items.map((existing) => (existing.id === id ? updated : existing));
  return updated;
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}