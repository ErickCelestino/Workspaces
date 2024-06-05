import { z } from 'zod';

const querySchema = z.object({
  loggedUserId: z.string().min(2),
});

const bodySchema = z
  .object({
    directoryId: z.string().min(3),
    file: z.string(),
  })
  .required();

export const createContentVideoSchema = z.object({
  query: querySchema,
  body: bodySchema,
});
