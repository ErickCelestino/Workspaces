import { z } from 'zod';

export const uploadProfileImageSchema = {
  files: z.any(),
  loggedUserId: z.string().min(1),
};
