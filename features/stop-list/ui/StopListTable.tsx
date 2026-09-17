'use client';

import { useMemo } from 'react';
import { Badge } from '@/shared/ui/Badge';
import { MenuFilters } from '../model/filters';
import { Button } from '@/shared/ui/Button';
import { matchesFilters } from '../model/filters';
import { useMenuItems } from '../model/queries';
import { useResumeItem } from '../model/use-stop-item';

const shopLabels: Record<string, string> = {
  kitchen: 'Кухня',
  bar: 'Бар',
  pastry: 'Кондитерская',
};

const reasonLabels: Record<string, string> = {
  out_of_stock: 'Закончились продукты',
  equipment: 'Сломалось оборудование',
  quality: 'Вопросы к качеству',
  menu_change: 'Снято из меню',
};

interface StopListTableProps {
  filters: MenuFilters;
}

export function StopListTable({ filters }: StopListTableProps) {
  const { data, isPending, isError, error } = useMenuItems();
  const resumeMutation = useResumeItem();

  const filteredItems = useMemo(() => {
    if (!data) return [];
    return data.filter((item) => matchesFilters(item, filters));
  }, [data, filters]);

  if (isPending) {
    return <p className="text-sm text-[#6D665D]">Загрузка меню…</p>;
  }

  if (isError) {
    return <p role="alert" className="text-sm text-[#C6462F]">Ошибка: {error.message}</p>;
  }

  if (data.length === 0) {
    return <p className="text-sm text-[#6D665D]">Меню смены пусто.</p>;
  }

  if (filteredItems.length === 0) {
    return <p className="text-sm text-[#6D665D]">Ничего не найдено по выбранным фильтрам.</p>;
  }

  return (
    <table className="w-full border-collapse overflow-hidden rounded-lg bg-white text-sm shadow-sm">
      <thead>
        <tr className="border-b border-[#EFEBE3] text-left text-xs uppercase tracking-wide text-[#6D665D]">
          <th className="px-4 py-3">Название</th>
          <th className="px-4 py-3">Цех</th>
          <th className="px-4 py-3">Остаток</th>
          <th className="px-4 py-3">Статус</th>
          <th className="px-4 py-3" />
        </tr>
      </thead>
      <tbody>
        {filteredItems.map((item) => (
          <tr key={item.id}  className={`border-b border-[#F6F3EE] last:border-0 ${
              item.status.kind === 'stopped' ? 'bg-[#F6F3EE]/60 text-[#6D665D]' : ''
            }`}>
            <td className="px-4 py-3 font-medium">{item.title}</td>
            <td className="px-4 py-3"><Badge tone="muted">{shopLabels[item.shop]}</Badge></td>
            <td className="px-4 py-3">{item.stock}</td>
            <td className="px-4 py-3">
              {item.status.kind === 'stopped' ? (
                <Badge tone="accent">
                  {reasonLabels[item.status.reason]}
                  {item.status.until
                    ? ` · до ${new Date(item.status.until).toLocaleTimeString()}`
                    : ' · до конца смены'}
                </Badge>
              ) : (
                <Badge tone="neutral">В продаже</Badge>
              )}
            </td>
            <td className="px-4 py-3 text-right">
              {item.status.kind === 'stopped' ? (
                <Button
                  variant="secondary"
                  disabled={item.stock === 0 || (resumeMutation.isPending && resumeMutation.variables === item.id)}
                  isLoading={resumeMutation.isPending && resumeMutation.variables === item.id}
                  onClick={() => resumeMutation.mutate(item.id)}
                  title={item.stock === 0 ? 'Нет остатка — сначала пополните позицию' : undefined}
                >
                  Вернуть в продажу
                </Button>
              ) : (
                <Button variant="secondary">Поставить в стоп</Button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}