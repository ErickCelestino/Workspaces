import { z } from 'zod';
import { EntityMinLength } from '../../messages';
import { InvalidEmail } from '../../messages/invalid-email';

export const LoginSchema = z
  .object({
    email: z.string().email({ message: InvalidEmail('PT-BR') }),
    password: z.string().min(3, {
      message: EntityMinLength({ entity: 'senha', minOrMax: 3 }, 'PT-BR'),
    }),
  })
  .required();
