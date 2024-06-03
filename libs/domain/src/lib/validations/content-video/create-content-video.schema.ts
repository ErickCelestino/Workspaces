import { z } from 'zod';

export const createContentVideoSchema = z
  .object({
    loggedUserId: z.string().min(2),
    directoryId: z.string().min(3),
    name: z.string().min(3).max(50),
    size: z.string().min(3).max(50),
    duration: z.string().min(3).max(50),
    resolution: z.string().min(3).max(50),
    format: z.string().min(3).max(50),
  })
  .required();
