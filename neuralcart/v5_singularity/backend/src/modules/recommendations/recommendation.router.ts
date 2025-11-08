import { Router, type Router as RouterType } from 'express';
import { asyncHandler } from '../../utils/async-handler';
import { getRecommendationsHandler } from './recommendation.controller';

export const recommendationRouter: RouterType = Router();

recommendationRouter.get('/', asyncHandler(getRecommendationsHandler));

