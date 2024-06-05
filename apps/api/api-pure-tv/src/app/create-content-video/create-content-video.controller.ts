import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import { CreateContentVideoService } from './create-content-video.service';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import {
  CreateContentVideo,
  CreateContentVideoDto,
  CreateContentVideoRequestDto,
  createContentVideoSchema,
} from '@workspaces/domain';

@Controller('create-content-video')
export class CreateContentVideoController {
  constructor(
    private readonly createContentVideoService: CreateContentVideoService
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createContentVideoSchema))
  async create(
    @Body() input: CreateContentVideoRequestDto,
    @Query('loggedUserId') loggedUserId: string
  ) {
    const dtoRequest: CreateContentVideoDto = {
      directoryId: input.directoryId,
      file: input.file,
      loggedUserId,
    };
    const result = await this.createContentVideoService.create(dtoRequest);

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
