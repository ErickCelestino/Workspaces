import { z } from 'zod';

export const editUserSchema = z
  .object({
    id: z.string().min(2),
    name: z.string().min(2).max(50),
    birthDate: z.string().optional(),
  })
  .required();
