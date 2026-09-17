'use client';

import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useMenuItems } from '../model/queries';
import { useStopItem } from '../model/use-stop-item';
import { useStopPanelStore } from '../model/stop-panel-store';
import { stopItemSchema, stopReasonValues } from '../model/stop-schema';
import { MAX_AHEAD_MS, roundUpToStep } from '../model/validate-until';
import type { StopReason } from '@/types/menu';
import { Button } from '@/shared/ui/Button';
import { Select } from '@/shared/ui/Select';

const reasonOptions = [
  { value: 'out_of_stock', label: 'Закончились продукты' },
  { value: 'equipment', label: 'Сломалось оборудование' },
  { value: 'quality', label: 'Вопросы к качеству' },
  { value: 'menu_change', label: 'Снято из меню' },
];

type UntilMode = 'shift-end' | 'custom';

function toDateTimeLocalValue(iso: string | null): string {
  if (!iso) return '';
  const date = new Date(iso);
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function StopReasonPanel() {
  const openItemId = useStopPanelStore((state) => state.openItemId);
  const closePanel = useStopPanelStore((state) => state.closePanel);
  const { data } = useMenuItems();
  const stopMutation = useStopItem();

  const item = data?.find((menuItem) => menuItem.id === openItemId) ?? null;
  const isEditing = item?.status.kind === 'stopped';

  const [reason, setReason] = useState<StopReason>(stopReasonValues[0]);
  const [untilMode, setUntilMode] = useState<UntilMode>('shift-end');
  const [untilValue, setUntilValue] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!item) return;

    if (item.status.kind === 'stopped') {
      setReason(item.status.reason);
      setUntilMode(item.status.until ? 'custom' : 'shift-end');
      setUntilValue(toDateTimeLocalValue(item.status.until));
    } else {
      setReason(stopReasonValues[0]);
      setUntilMode('shift-end');
      setUntilValue('');
    }
    setFormError(null);
  }, [item]);

  if (!item) return null;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!item) return;
    const until = untilMode === 'shift-end' ? null : untilValue ? new Date(untilValue).toISOString() : null;

    if (untilMode === 'custom' && !until) {
      setFormError('Укажите время');
      return;
    }

    const parsed = stopItemSchema.safeParse({ reason, until });

    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? 'Проверьте заполненные поля');
      return;
    }

    setFormError(null);
    stopMutation.mutate(
      { id: item.id, payload: parsed.data },
      { onSuccess: () => closePanel() },
    );
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-1 text-lg font-semibold text-[#171512]">
          {isEditing ? 'Изменить стоп-лист' : 'Поставить в стоп-лист'}
        </h2>
        <p className="mb-4 text-sm text-[#6D665D]">{item.title}</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-[#171512]">Причина</label>
            <Select
              options={reasonOptions}
              value={reason}
              onChange={(event) => setReason(event.target.value as StopReason)}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[#171512]">Срок</label>
            <div className="flex gap-4 text-sm text-[#171512]">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={untilMode === 'shift-end'}
                  onChange={() => setUntilMode('shift-end')}
                />
                До конца смены
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={untilMode === 'custom'}
                  onChange={() => setUntilMode('custom')}
                />
                Конкретное время
              </label>
            </div>

            {untilMode === 'custom' && (
              <input
                type="datetime-local"
                value={untilValue}
                onChange={(event) => setUntilValue(event.target.value)}
                step={900}
                min={toDateTimeLocalValue(roundUpToStep(new Date()).toISOString())}
                max={toDateTimeLocalValue(new Date(Date.now() + MAX_AHEAD_MS).toISOString())}
                className={`mt-2 w-full rounded-md border px-3 py-2 text-sm text-[#171512] focus:outline-none focus:ring-1 focus:ring-[#C6462F] ${
                formError ? 'border-[#C6462F]' : 'border-[#D8D2C7] focus:border-[#C6462F]'}`}
              />
            )}
          </div>

          {formError && <p className="text-sm text-[#C6462F]">{formError}</p>}

          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={closePanel}>
              Отмена
            </Button>
            <Button type="submit" isLoading={stopMutation.isPending}>
              {stopMutation.isPending ? 'Сохранение…' : 'Сохранить'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}