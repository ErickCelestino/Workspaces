/* eslint-disable @typescript-eslint/no-explicit-any */
import { PipeTransform, BadRequestException } from '@nestjs/common';
import { ZodObject } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodObject<any>) {}

  transform(value: unknown) {
    try {
      const parsedData = this.schema.parse(value);
      return parsedData;
    } catch (error) {
      throw new BadRequestException({
        error: {
          name: 'SchemaError',
          message: error.message,
        },
      });
    }
  }
}
