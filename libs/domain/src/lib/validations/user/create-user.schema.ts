import { z } from 'zod';

export const createUserSchema = z
  .object({
    name: z.string().min(2).max(50),
    nickname: z.string().min(3).max(50),
    birthDate: z.string().optional(),
  })
  .required();
