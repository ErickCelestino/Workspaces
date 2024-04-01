import { z } from 'zod';
import { EntityMaxLength, EntityMinLength } from '../../messages';

export const CreateUserSchema = z
  .object({
    name: z
      .string()
      .min(2, {
        message: EntityMinLength({ entity: 'nome', minOrMax: 2 }, 'PT-BR'),
      })
      .max(50, {
        message: EntityMaxLength({ entity: 'nome', minOrMax: 50 }, 'PT-BR'),
      }),
    nickname: z
      .string()
      .min(2, {
        message: EntityMinLength({ entity: 'nickname', minOrMax: 2 }, 'PT-BR'),
      })
      .max(50, {
        message: EntityMaxLength({ entity: 'nickname', minOrMax: 50 }, 'PT-BR'),
      }),
    birthDate: z.string().optional(),
  })
  .required();
