import { z } from 'zod';

export const createCompanySchema = z
  .object({
    fantasy_name: z.string().min(2).max(50),
    cnpj: z.string().min(2).max(14),
  })
  .required();
