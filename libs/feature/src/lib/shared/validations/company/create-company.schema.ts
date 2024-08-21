import { z } from 'zod';
import {
  EntityIsInvalid,
  EntityMaxLength,
  EntityMinLength,
} from '../../messages';
import { isValidCNPJ } from '../utils';

export const CreateCompanyFormSchema = z.object({
  fantasyName: z
    .string()
    .min(2, {
      message: EntityMinLength({ entity: 'nome', minOrMax: 2 }, 'PT-BR'),
    })
    .max(50, {
      message: EntityMaxLength({ entity: 'nome', minOrMax: 50 }, 'PT-BR'),
    }),
  socialReason: z
    .string()
    .min(2, {
      message: EntityMinLength({ entity: 'nome', minOrMax: 2 }, 'PT-BR'),
    })
    .max(50, {
      message: EntityMaxLength({ entity: 'nome', minOrMax: 50 }, 'PT-BR'),
    }),
  cnpj: z.string().refine(isValidCNPJ, {
    message: EntityIsInvalid('CNPJ', 'PT-BR'),
  }),
});
