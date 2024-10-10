import { Controller, Post, Query, UploadedFiles } from '@nestjs/common';
import { UploadProfileImageService } from './upload-profile-image.service';
import { ErrorMessageResult } from '@workspaces/domain';

@Controller('upload-profile-image')
export class UploadProfileImageController {
  constructor(
    private readonly uploadProfileImageService: UploadProfileImageService
  ) {}

  @Post()
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
