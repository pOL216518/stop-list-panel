import { NextResponse } from 'next/server';
import { delay, getMenuItem, stopMenuItem } from '@/server/menu-store';
import type { StopItemPayload, StopReason } from '@/types/menu';

const STOP_REASONS: StopReason[] = ['out_of_stock', 'equipment', 'quality', 'menu_change'];

function isStopItemPayload(value: unknown): value is StopItemPayload {
  if (typeof value !== 'object' || value === null) return false;
  const payload = value as Record<string, unknown>;
  return (
    typeof payload.reason === 'string' &&
    STOP_REASONS.includes(payload.reason as StopReason) &&
    (payload.until === null || typeof payload.until === 'string')
  );
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => null);

  if (!isStopItemPayload(body)) {
    return NextResponse.json({ message: 'Некорректные данные для постановки в стоп-лист' }, { status: 400 });
  }

  if (!getMenuItem(id)) {
    return NextResponse.json({ message: 'Позиция не найдена' }, { status: 404 });
  }

  await delay(600);

  if (Math.random() < 0.2) {
    return NextResponse.json({ message: 'Не удалось сохранить изменения, попробуйте ещё раз' }, { status: 500 });
  }

  const updated = stopMenuItem(id, body);
  return NextResponse.json(updated);
}