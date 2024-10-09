import { z } from 'zod';

export const editProfileSchema = {
  body: z.object({
    name: z.string().min(1),
    nickname: z.string().min(1),
    bithDate: z.string().optional(),
  }),
  loggedUserId: z.string().min(1),
  userId: z.string().min(1),
};
