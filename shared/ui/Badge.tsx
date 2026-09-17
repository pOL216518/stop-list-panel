import type { ReactNode } from 'react';

type BadgeTone = 'neutral' | 'accent' | 'muted';

interface BadgeProps {
  tone?: BadgeTone;
  children: ReactNode;
}

const tones: Record<BadgeTone, string> = {
  neutral: 'bg-[#EFEBE3] text-[#171512]',
  accent: 'bg-[#C6462F]/10 text-[#C6462F]',
  muted: 'bg-[#EFEBE3] text-[#6D665D]',
};

export function Badge({ tone = 'neutral', children }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}