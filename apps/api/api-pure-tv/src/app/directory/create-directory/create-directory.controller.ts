import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UsePipes,
} from '@nestjs/common';
import { CreateDirectoryService } from './create-directory.service';
import {
  CreateDirectoryDto,
  CreateDirectoryResponseDto,
  createDirectorySchema,
} from '@workspaces/domain';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';

@Controller('create-directory')
export class CreateDirectoryController {
  constructor(
    private readonly createDirectoryService: CreateDirectoryService
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createDirectorySchema))
  async create(@Body() input: CreateDirectoryDto) {
    const result = await this.createDirectoryService.create(input);
    const response: CreateDirectoryResponseDto = {
      directory_id: `${result.value}`,
    };

    if (result.isRight()) return response;
    else
      throw new BadRequestException({
        error: {
          name: result.value.name,
          message: result.value.message,
        },
      });
  }
}
