import { z } from 'zod';

export const editDeviceSchema = {
  input: z.object({
    name: z.string().min(1),
  }),
  loggedUserId: z.string().min(1),
  id: z.string().min(1),
};