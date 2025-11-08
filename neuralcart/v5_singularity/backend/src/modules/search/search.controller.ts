import { Request, Response } from 'express';
import { HttpError } from '../../utils/http-error';
import { searchService } from '../../lib/search';
import { searchQuerySchema } from './search.schema';

export const searchProductsHandler = async (req: Request, res: Response) => {
  if (!searchService.isEnabled()) {
    throw new HttpError(503, 'Search service unavailable');
  }

  const parseResult = searchQuerySchema.safeParse(req.query);

  if (!parseResult.success) {
    throw new HttpError(400, 'Invalid query parameters', parseResult.error.flatten());
  }

  const { q, limit } = parseResult.data;
  const results = await searchService.searchProducts(q, limit);

  res.status(200).json({
    data: results
  });
};

