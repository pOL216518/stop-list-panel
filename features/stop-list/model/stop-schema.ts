import { z } from 'zod';
import { validateUntil } from './validate-until';

export const stopReasonValues = ['out_of_stock', 'equipment', 'quality', 'menu_change'] as const;

export const stopItemSchema = z
  .object({
  reason: z.enum(stopReasonValues),
  until: z.string().nullable(),
  })
  .superRefine((value, ctx) => {
    const message = validateUntil(value.until);
    if (message) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message, path: ['until'] });
    }
 });

export type StopItemFormValues = z.infer<typeof stopItemSchema>;