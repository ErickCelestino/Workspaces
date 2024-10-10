import {
  Controller,
  Post,
  Query,
  UploadedFiles,
  UsePipes,
} from '@nestjs/common';
import { UploadProfileImageService } from './upload-profile-image.service';
import {
  ErrorMessageResult,
  uploadProfileImageSchema,
} from '@workspaces/domain';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';

@Controller('upload-profile-image')
export class UploadProfileImageController {
  constructor(
    private readonly uploadProfileImageService: UploadProfileImageService
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(uploadProfileImageSchema))
  async upload(
    @Query('loggedUserId') loggedUserId: string,
    @UploadedFiles() file: Express.Multer.File
  ) {
    const result = await this.uploadProfileImageService.upload({
      file,
      loggedUserId,
    });

    if (result.isRight()) return { userAndCompanyId: result.value };
    else await ErrorMessageResult(result.value.name, result.value.message);
  }
}
