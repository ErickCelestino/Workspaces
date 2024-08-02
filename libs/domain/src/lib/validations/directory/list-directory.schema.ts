import { z } from 'zod';

export const listDirectorySchema = {
  loggedUserId: z.string().min(1),
  filter: z.string().optional(),
  take: z.string().optional(),
  skip: z.string().optional(),
};
