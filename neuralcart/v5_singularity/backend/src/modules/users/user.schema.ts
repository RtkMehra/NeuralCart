import { z } from 'zod';

const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20)
});

export const listUsersSchema = paginationSchema;

export const createUserSchema = z.object({
  email: z.string().trim().email(),
  name: z.string().min(1).max(255),
  password: z.string().min(6, 'Password must be at least 6 characters long')
});

export const updateUserSchema = z
  .object({
    name: z.string().min(1).max(255).optional(),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters long')
      .optional()
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one field must be provided for update'
  });

export type ListUsersInput = z.infer<typeof listUsersSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

