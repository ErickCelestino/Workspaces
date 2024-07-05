import { Injectable } from '@nestjs/common';
import {
  DownloadContentFile,
  DownloadContentFileDto,
} from '@workspaces/domain';

@Injectable()
export class DownloadContentFileService {
  constructor(private useCase: DownloadContentFile) {}

  async download(input: DownloadContentFileDto) {
    return await this.useCase.execute(input);
  }
}
