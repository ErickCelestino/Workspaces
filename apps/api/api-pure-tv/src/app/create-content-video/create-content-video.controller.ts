import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UsePipes,
} from '@nestjs/common';
import { CreateContentVideoService } from './create-content-video.service';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import {
  CreateContentVideoDto,
  createContentVideoSchema,
} from '@workspaces/domain';

@Controller('create-content-video')
export class CreateContentVideoController {
  constructor(
    private readonly createContentVideoService: CreateContentVideoService
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createContentVideoSchema))
  async create(@Body() input: CreateContentVideoDto) {
    const result = await this.createContentVideoService.create(input);

    if (result.isRight()) return result.value;
    else
      throw new BadRequestException({
        error: {
          name: result.value.name,
          message: result.value.message,
        },
      });
  }
}
