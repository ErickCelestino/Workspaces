import {
  BadRequestException,
  Controller,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateContentFileService } from './create-content-file.service';
import {
  CreateContentFileDto,
  UploadedFile,
  createContentFileSchema,
} from '@workspaces/domain';
import { FileLocalStorage, FileS3Storage } from '@workspaces/data-access';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';

@Controller('create-content-file')
export class CreateContentFileController {
  constructor(
    private readonly createContentVideoService: CreateContentFileService
  ) {}

  @UsePipes(new ZodValidationPipe(createContentFileSchema))
  @Post()
  @UseInterceptors(
    FilesInterceptor('files', undefined, {
      storage: FileS3Storage.Storage,
    })
  )
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