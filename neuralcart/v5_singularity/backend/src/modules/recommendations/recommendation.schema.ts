import { z } from 'zod';

export const recommendationQuerySchema = z.object({
    productId: z.string().uuid('productId must be a valid UUID'),
    limit: z.coerce.number().int().positive().max(10).default(5)
});

export type RecommendationQueryInput = z.infer<typeof recommendationQuerySchema>;

