import { NextResponse } from 'next/server';
import { delay, getMenuItem, resumeMenuItem } from '@/server/menu-store';

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = getMenuItem(id);

  if (!item) {
    return NextResponse.json({ message: 'Позиция не найдена' }, { status: 404 });
  }

  if (item.stock === 0) {
    return NextResponse.json({ message: 'Нет остатка — нельзя вернуть в продажу' }, { status: 400 });
  }

  await delay(600);

  if (Math.random() < 0.2) {
    return NextResponse.json({ message: 'Не удалось сохранить изменения, попробуйте ещё раз' }, { status: 500 });
  }

  const updated = resumeMenuItem(id);
  return NextResponse.json(updated);
}