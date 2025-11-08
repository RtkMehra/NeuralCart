import { Router, type Router as RouterType } from 'express';
import { asyncHandler } from '../../utils/async-handler';
import { searchProductsHandler } from './search.controller';

export const searchRouter: RouterType = Router();

searchRouter.get('/', asyncHandler(searchProductsHandler));

