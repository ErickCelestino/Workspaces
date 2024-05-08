import { z } from 'zod';

export const createAuthSchema = z
  .object({
    userId: z.string(),
    email: z.string().email(),
    password: z.string().min(3),
  })
  .required();
