import bcrypt from 'bcryptjs';
import { AppDataSource } from '../../config/data-source';
import { User } from '../../entities/User';
import { HttpError } from '../../utils/http-error';
import {
  CreateUserInput,
  ListUsersInput,
  UpdateUserInput
} from './user.schema';

const userRepository = () => AppDataSource.getRepository(User);

export const listUsers = async ({ page, limit }: ListUsersInput) => {
  const repository = userRepository();

  const [items, total] = await repository.findAndCount({
    skip: (page - 1) * limit,
    take: limit,
    order: {
      createdAt: 'DESC'
    }
  });

  return { items, total, page, limit };
};

export const getUserById = async (id: string) => {
  const user = await userRepository().findOne({
    where: { id }
  });

  if (!user) {
    throw new HttpError(404, 'User not found');
  }

  return user;
};

export const createUser = async (input: CreateUserInput) => {
  const repository = userRepository();

  const existing = await repository.findOne({
    where: { email: input.email }
  });

  if (existing) {
    throw new HttpError(409, 'Email already exists');
  }

  const passwordHash = await bcrypt.hash(input.password, 10);

  const user = repository.create({
    email: input.email,
    name: input.name,
    passwordHash
  });

  return repository.save(user);
};

export const updateUser = async (id: string, input: UpdateUserInput) => {
  const repository = userRepository();
  const user = await repository.findOne({ where: { id } });

  if (!user) {
    throw new HttpError(404, 'User not found');
  }

  if (input.name !== undefined) {
    user.name = input.name;
  }

  if (input.password !== undefined) {
    user.passwordHash = await bcrypt.hash(input.password, 10);
  }

  return repository.save(user);
};

export const deleteUser = async (id: string) => {
  const repository = userRepository();
  const user = await repository.findOne({ where: { id } });

  if (!user) {
    throw new HttpError(404, 'User not found');
  }

  await repository.remove(user);
};

