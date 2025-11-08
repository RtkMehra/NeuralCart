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

export const listProductsHandler = async (req: Request, res: Response) => {
  const parseResult = listProductsSchema.safeParse(req.query);

  if (!parseResult.success) {
    throw new HttpError(400, 'Invalid query parameters', parseResult.error.flatten());
  }

  const result = await listProducts(parseResult.data);

  res.status(200).json({
    data: result.items.map(mapProductToResponse),
    meta: {
      total: result.total,
      page: result.page,
      limit: result.limit
    }
  });
};

export const getProductHandler = async (req: Request, res: Response) => {
  const product = await getProductById(req.params.id);
  res.status(200).json({ data: mapProductToResponse(product) });
};

export const createProductHandler = async (req: Request, res: Response) => {
  const parseResult = createProductSchema.safeParse(req.body);

  if (!parseResult.success) {
    throw new HttpError(400, 'Invalid payload', parseResult.error.flatten());
  }

  const product = await createProduct(parseResult.data);
  res.status(201).json({ data: mapProductToResponse(product) });
};

export const updateProductHandler = async (req: Request, res: Response) => {
  const parseResult = updateProductSchema.safeParse(req.body);

  if (!parseResult.success) {
    throw new HttpError(400, 'Invalid payload', parseResult.error.flatten());
  }

  const product = await updateProduct(req.params.id, parseResult.data);
  res.status(200).json({ data: mapProductToResponse(product) });
};

export const deleteProductHandler = async (req: Request, res: Response) => {
  await deleteProduct(req.params.id);
  res.status(204).send();
};

