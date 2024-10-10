import { Injectable } from '@nestjs/common';
import { UploadProfileImage, UploadProfileImageDto } from '@workspaces/domain';

@Injectable()
export class UploadProfileImageService {
  constructor(private useCase: UploadProfileImage) {}

  async upload(input: UploadProfileImageDto) {
    return await this.useCase.execute(input);
  }
}
