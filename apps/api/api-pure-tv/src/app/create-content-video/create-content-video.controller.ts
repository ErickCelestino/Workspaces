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
import { CreateContentVideoDto } from '@workspaces/domain';

@Controller('create-content-video')
export class CreateContentVideoController {
  constructor(
    private readonly createContentVideoService: CreateContentVideoService
  ) {}

  @Post()
  async create(
    @Body() input: { file: string },
    @Query('loggedUserId') loggedUserId: string,
    @Query('directoryId') directoryId: string
  ) {
    const dtoRequest: CreateContentVideoDto = {
      directoryId: directoryId,
      file: input.file,
      loggedUserId,
    };
    console.log(dtoRequest);
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
