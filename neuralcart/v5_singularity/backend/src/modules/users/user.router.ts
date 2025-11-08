import { Router, type Router as RouterType } from 'express';
import { asyncHandler } from '../../utils/async-handler';
import {
  createUserHandler,
  deleteUserHandler,
  getUserHandler,
  listUsersHandler,
  updateUserHandler
} from './user.controller';

export const userRouter: RouterType = Router();

userRouter.get('/', asyncHandler(listUsersHandler));
userRouter.get('/:id', asyncHandler(getUserHandler));
userRouter.post('/', asyncHandler(createUserHandler));
userRouter.put('/:id', asyncHandler(updateUserHandler));
userRouter.delete('/:id', asyncHandler(deleteUserHandler));

