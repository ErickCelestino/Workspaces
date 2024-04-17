import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UsePipes,
} from '@nestjs/common';
import { CreateUserService } from './create-user.service';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { CreateUserDto, createUserSchema } from '@workspaces/domain';

@Controller('create-user')
export class CreateUserController {
  constructor(private readonly createUserService: CreateUserService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createUserSchema))
  async create(@Body() input: CreateUserDto) {
    const result = await this.createUserService.create(input);

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
