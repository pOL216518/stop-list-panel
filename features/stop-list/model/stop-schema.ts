import { z } from 'zod';

export const stopReasonValues = ['out_of_stock', 'equipment', 'quality', 'menu_change'] as const;

export const stopItemSchema = z.object({
  reason: z.enum(stopReasonValues),
  until: z.string().nullable(),
});

export type StopItemFormValues = z.infer<typeof stopItemSchema>;