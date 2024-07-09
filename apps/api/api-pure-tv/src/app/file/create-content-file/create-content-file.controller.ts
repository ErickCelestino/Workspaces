import {
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
  ErrorMessageResult,
  UploadedFile,
  createContentFileSchema,
} from '@workspaces/domain';
import { FileS3Storage } from '@workspaces/data-access';
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
      fileFilter: FileS3Storage.fileFilter,
    })
  )
  async create(
    @UploadedFiles() files: UploadedFile[],
    @Query('loggedUserId') loggedUserId: string,
    @Query('directoryId') directoryId: string
  ) {
    const uploadedFileNames = FileS3Storage.getUploadedFileNames();
    const updatedFiles = files.map((file, index) => ({
      ...file,
      filename: uploadedFileNames[index],
    }));
    const result = await this.createContentVideoService.create({
      directoryId: directoryId,
      file: updatedFiles,
      loggedUserId,
    });

    if (result.isRight()) return result.value;
    else ErrorMessageResult(result.value.name, result.value.message);
  }
}
