import { z } from 'zod';

export const deleteProductSchema = {
  id: z.string().min(1),
  loggedUserId: z.string().min(1),
};
