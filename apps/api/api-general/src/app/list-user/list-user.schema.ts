import { z } from 'zod';

export const listUserSchema = z.object({
  input: z.string().min(1).max(50),
});
