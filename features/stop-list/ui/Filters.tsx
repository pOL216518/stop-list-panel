'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Select } from '@/shared/ui/Select';
import { filtersToSearchParams } from '../model/filters';
import type { MenuFilters } from '../model/filters';

interface FiltersProps {
  filters: MenuFilters;
}

const shopOptions = [
  { value: 'kitchen', label: 'Кухня' },
  { value: 'bar', label: 'Бар' },
  { value: 'pastry', label: 'Кондитерская' },
];

const statusOptions = [
  { value: 'available', label: 'В продаже' },
  { value: 'stopped', label: 'В стоп-листе' },
];

export function Filters({ filters }: FiltersProps) {
  const router = useRouter();
  const pathname = usePathname();

  function updateFilters(next: Partial<MenuFilters>) {
    const merged: MenuFilters = { ...filters, ...next };
    const params = filtersToSearchParams(merged);
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <div className="mb-4 flex gap-3">
      <Select
        options={shopOptions}
        placeholder="Все цеха"
        value={filters.shop ?? ''}
        onChange={(event) => updateFilters({ shop: (event.target.value || null) as MenuFilters['shop'] })}
      />
      <Select
        options={statusOptions}
        placeholder="Любой статус"
        value={filters.status ?? ''}
        onChange={(event) => updateFilters({ status: (event.target.value || null) as MenuFilters['status'] })}
      />
    </div>
  );
}