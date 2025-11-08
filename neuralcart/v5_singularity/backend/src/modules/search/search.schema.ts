import { z } from 'zod';

export const searchQuerySchema = z.object({
  q: z.string().trim().min(1, 'Query is required'),
  limit: z.coerce.number().int().positive().max(25).default(10)
});

export type SearchQueryInput = z.infer<typeof searchQuerySchema>;

