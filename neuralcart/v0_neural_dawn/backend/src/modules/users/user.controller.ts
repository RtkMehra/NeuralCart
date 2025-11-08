import { Request, Response } from 'express';
import { HttpError } from '../../utils/http-error';
import {
  createUser,
  deleteUser,
  getUserById,
  listUsers,
  updateUser
} from './user.service';
import {
  createUserSchema,
  listUsersSchema,
  updateUserSchema
} from './user.schema';
import { mapUserToResponse } from './user.mapper';

export const listUsersHandler = async (req: Request, res: Response) => {
  const parseResult = listUsersSchema.safeParse(req.query);

  if (!parseResult.success) {
    throw new HttpError(400, 'Invalid query parameters', parseResult.error.flatten());
  }

  const result = await listUsers(parseResult.data);

  res.status(200).json({
    data: result.items.map(mapUserToResponse),
    meta: {
      total: result.total,
      page: result.page,
      limit: result.limit
    }
  });
};

export const getUserHandler = async (req: Request, res: Response) => {
  const user = await getUserById(req.params.id);
  res.status(200).json({ data: mapUserToResponse(user) });
};

export const createUserHandler = async (req: Request, res: Response) => {
  const parseResult = createUserSchema.safeParse(req.body);

  if (!parseResult.success) {
    throw new HttpError(400, 'Invalid payload', parseResult.error.flatten());
  }

  const user = await createUser(parseResult.data);
  res.status(201).json({ data: mapUserToResponse(user) });
};

export const updateUserHandler = async (req: Request, res: Response) => {
  const parseResult = updateUserSchema.safeParse(req.body);

  if (!parseResult.success) {
    throw new HttpError(400, 'Invalid payload', parseResult.error.flatten());
  }

  const user = await updateUser(req.params.id, parseResult.data);
  res.status(200).json({ data: mapUserToResponse(user) });
};

export const deleteUserHandler = async (req: Request, res: Response) => {
  await deleteUser(req.params.id);
  res.status(204).send();
};

