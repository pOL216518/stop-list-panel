export const MAX_AHEAD_MS = 24 * 60 * 60 * 1000;
export const STEP_MS = 15 * 60 * 1000;

export function validateUntil(value: string | null, now: number = Date.now()): string | null {
  if (value === null) return null; // до конца смены — всегда валидно

  const ts = Date.parse(value);
  if (Number.isNaN(ts)) return 'Некорректное время';
  if (ts <= now) return 'Время должно быть в будущем';
  if (ts - now > MAX_AHEAD_MS) return 'Не больше чем на 24 часа вперёд';
  if (ts % STEP_MS !== 0) return 'Шаг — 15 минут';

  return null; 
}

export function roundUpToStep(date: Date, stepMs: number = STEP_MS): Date {
  const ms = date.getTime();
  return new Date(Math.ceil(ms / stepMs) * stepMs);
}