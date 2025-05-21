
import { z } from 'zod';

// Click schema for tracking user clicks
export const clickSchema = z.object({
  id: z.number(),
  ip_address: z.string().nullable(), // IP address is nullable as it might not always be available
  user_agent: z.string().nullable(), // User agent is nullable for the same reason
  created_at: z.coerce.date(), // Store timestamp when click happened
});

export type Click = z.infer<typeof clickSchema>;

// Input schema for creating clicks
export const createClickInputSchema = z.object({
  ip_address: z.string().nullable().optional(), // Optional as it might not be provided
  user_agent: z.string().nullable().optional(), // Optional as it might not be provided
});

export type CreateClickInput = z.infer<typeof createClickInputSchema>;

// Schema for click counts response
export const clickCountSchema = z.object({
  count: z.number().int().nonnegative(),
});

export type ClickCount = z.infer<typeof clickCountSchema>;
