import { z } from 'zod';

export const deleteUserByIdSchema = z
  .object({
    id: z.string().min(2),
  })
  .required();
