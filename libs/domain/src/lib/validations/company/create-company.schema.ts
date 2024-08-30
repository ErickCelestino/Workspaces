import { z } from 'zod';

export const createCompanySchema = {
  body: z.object({
    cnpj: z.string().min(1),
    fantasyName: z.string().min(1),
    socialReason: z.string().min(1),
  }),
  loggedUserId: z.string().min(1),
};
