import { z } from 'zod';

export const createUserSchema = z
  .object({
    name: z.string().min(2).max(50),
    nickName: z.string().min(3).max(50),
    birth_date: z.date().optional(),
  })
  .required();
