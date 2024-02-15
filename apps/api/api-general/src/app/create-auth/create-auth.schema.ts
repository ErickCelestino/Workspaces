import { z } from 'zod';

export const createAuthSchema = z
  .object({
    user_id: z.string(),
    email: z.string().email(),
    password: z.string().min(3),
  })
  .required();
