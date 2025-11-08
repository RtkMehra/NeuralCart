import { Request, Response } from 'express';
import { HttpError } from '../../utils/http-error';
import {
  createProduct,
  deleteProduct,
  getProductById,
  listProducts,
  updateProduct
} from './product.service';
import {
  createProductSchema,
  listProductsSchema,
  updateProductSchema
} from './product.schema';
import { mapProductToResponse } from './product.mapper';
import { productCache } from './product.cache';
import { recommendationService } from '../../lib/recommendation';
import { logger } from '../../lib/logger';

export const listProductsHandler = async (req: Request, res: Response) => {
  const parseResult = listProductsSchema.safeParse(req.query);

  if (!parseResult.success) {
    throw new HttpError(400, 'Invalid query parameters', parseResult.error.flatten());
  }

  const params = parseResult.data;
  const cached = await productCache.getList(params);

  if (cached) {
    return res.status(200).json(cached);
  }

  const result = await listProducts(params);

  const payload = {
    data: result.items.map(mapProductToResponse),
    meta: {
      total: result.total,
      page: result.page,
      limit: result.limit
    }
  };

  await productCache.setList(params, payload);

  res.status(200).json(payload);
};

export const getProductHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  const cached = await productCache.getDetail(id);

  if (cached) {
    return res.status(200).json({ data: cached });
  }

  const product = await getProductById(id);
  const response = mapProductToResponse(product);

  await productCache.setDetail(id, response);

  res.status(200).json({ data: response });
};

export const createProductHandler = async (req: Request, res: Response) => {
  const parseResult = createProductSchema.safeParse(req.body);

  if (!parseResult.success) {
    throw new HttpError(400, 'Invalid payload', parseResult.error.flatten());
  }

  const product = await createProduct(parseResult.data);
  const response = mapProductToResponse(product);

  await productCache.invalidateLists();
  await productCache.setDetail(product.id, response);
  void recommendationService.updateEmbedding(product).catch((error) => {
    logger.warn({ err: error, productId: product.id }, 'Embedding update failed after create');
  });

  res.status(201).json({ data: response });
};

export const updateProductHandler = async (req: Request, res: Response) => {
  const parseResult = updateProductSchema.safeParse(req.body);

  if (!parseResult.success) {
    throw new HttpError(400, 'Invalid payload', parseResult.error.flatten());
  }

  const product = await updateProduct(req.params.id, parseResult.data);
  const response = mapProductToResponse(product);

  await productCache.invalidateLists();
  await productCache.setDetail(product.id, response);
  void recommendationService.updateEmbedding(product).catch((error) => {
    logger.warn({ err: error, productId: product.id }, 'Embedding update failed after update');
  });

  res.status(200).json({ data: response });
};

export const deleteProductHandler = async (req: Request, res: Response) => {
  await deleteProduct(req.params.id);
  await productCache.invalidateAll();
  res.status(204).send();
};

