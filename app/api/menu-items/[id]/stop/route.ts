import { NextResponse } from 'next/server';
import { delay, getMenuItem, stopMenuItem } from '@/server/menu-store';
import { stopItemSchema } from '@/features/stop-list/model/stop-schema';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = stopItemSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: 'Некорректные данные для постановки в стоп-лист' }, { status: 400 });
  }

  if (!getMenuItem(id)) {
    return NextResponse.json({ message: 'Позиция не найдена' }, { status: 404 });
  }

  await delay(600);

  if (Math.random() < 0.2) {
    return NextResponse.json({ message: 'Не удалось сохранить изменения, попробуйте ещё раз' }, { status: 500 });
  }

  const updated = stopMenuItem(id, parsed.data);
  return NextResponse.json(updated);
}