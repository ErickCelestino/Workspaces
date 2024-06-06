import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateContentFileService } from './create-content-file.service';
import { CreateContentFileDto, UploadedFile } from '@workspaces/domain';

@Controller('create-content-video')
export class CreateContentFileController {
  constructor(
    private readonly createContentVideoService: CreateContentFileService
  ) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async create(
    @UploadedFiles() files: UploadedFile[],
    @Query('loggedUserId') loggedUserId: string,
    @Query('directoryId') directoryId: string
  ) {
    const dtoRequest: CreateContentFileDto = {
      directoryId: directoryId,
      file: files,
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
