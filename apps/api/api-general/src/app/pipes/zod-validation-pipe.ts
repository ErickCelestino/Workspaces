/* eslint-disable @typescript-eslint/no-explicit-any */
import { PipeTransform, BadRequestException } from '@nestjs/common';
import { ZodObject } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodObject<any>) {}

  transform(value: unknown) {
    try {
      this.schema.parse(value);
    } catch (error) {
      error.name = 'SchemaError';
      throw new BadRequestException(error);
    }
    return value;
  }
}
