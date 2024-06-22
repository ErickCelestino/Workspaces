import { z } from 'zod';

export const deleteUserByIdSchema = {
  id: z.string().min(1),
};
