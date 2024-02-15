import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UsePipes,
} from '@nestjs/common';
import { CreateAuthService } from './create-auth.service';
import { createAuthSchema } from './create-auth.schema';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { CreateAuthDto } from '@workspaces/domain';

@Controller('create-auth')
export class CreateAuthController {
  constructor(private readonly createAuthService: CreateAuthService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createAuthSchema))
  async create(@Body() input: CreateAuthDto) {
    const result = await this.createAuthService.create(input);

    if (result.isRight()) return;
    else
      throw new BadRequestException({
        error: {
          name: result.value.name,
          message: result.value.message,
        },
      });
  }
}
