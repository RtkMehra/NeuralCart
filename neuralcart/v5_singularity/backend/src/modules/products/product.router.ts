import { Router, type Router as RouterType } from 'express';
import { asyncHandler } from '../../utils/async-handler';
import {
    createProductHandler,
    deleteProductHandler,
    getProductHandler,
    listProductsHandler,
    updateProductHandler
} from './product.controller';

export const productRouter: RouterType = Router();

productRouter.get('/', asyncHandler(listProductsHandler));
productRouter.get('/:id', asyncHandler(getProductHandler));
productRouter.post('/', asyncHandler(createProductHandler));
productRouter.put('/:id', asyncHandler(updateProductHandler));
productRouter.delete('/:id', asyncHandler(deleteProductHandler));

