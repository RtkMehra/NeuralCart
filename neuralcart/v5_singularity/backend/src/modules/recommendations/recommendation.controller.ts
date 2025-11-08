import { Request, Response } from 'express';
import { HttpError } from '../../utils/http-error';
import { recommendationService } from '../../lib/recommendation';
import { recommendationQuerySchema } from './recommendation.schema';
import { getProductById } from '../products/product.service';
import { mapProductToResponse } from '../products/product.mapper';

export const getRecommendationsHandler = async (req: Request, res: Response) => {
    const parseResult = recommendationQuerySchema.safeParse(req.query);

    if (!parseResult.success) {
        throw new HttpError(400, 'Invalid query parameters', parseResult.error.flatten());
    }

    const { productId, limit } = parseResult.data;
    const product = await getProductById(productId);

    // Ensure embedding exists
    await recommendationService.ensureProductEmbedding(productId);

    const recommendations = await recommendationService.getRecommendations(productId, limit);

    res.status(200).json({
        data: recommendations,
        context: {
            product: mapProductToResponse(product)
        }
    });
};

