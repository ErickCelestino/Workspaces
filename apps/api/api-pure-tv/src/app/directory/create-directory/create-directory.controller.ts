import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import { CreateDirectoryService } from './create-directory.service';
import {
  CreateDirectoryBodyDto,
  CreateDirectoryResponseDto,
  CreateDirectorySchema,
} from '@workspaces/domain';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';

@Controller('create-directory')
export class CreateDirectoryController {
  constructor(
    private readonly createDirectoryService: CreateDirectoryService
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateDirectorySchema))
  async create(
    @Query('loggedUserId') loggedUserId: string,
    @Body() body: CreateDirectoryBodyDto
  ) {
    const result = await this.createDirectoryService.create({
      body,
      loggedUserId,
    });
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
