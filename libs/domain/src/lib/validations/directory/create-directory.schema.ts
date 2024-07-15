import { z } from 'zod';

export const CreateDirectorySchema = {
  name: z.string().min(1),
  loggedUserId: z.string().min(1),
};
