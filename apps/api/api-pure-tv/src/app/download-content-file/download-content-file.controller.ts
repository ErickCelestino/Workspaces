import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { DownloadContentFileService } from './download-content-file.service';
import { DownloadContentFileDto } from '@workspaces/domain';

@Controller('download-content-file')
export class DownloadContentFileController {
  constructor(
    private readonly downloadContentFileService: DownloadContentFileService
  ) {}

  @Get(':id')
  async download(
    @Param('id') idToDownload: string,
    @Query('loggedUserId') loggedUserId: string,
    @Query('directoryId') directoryId: string
  ) {
    const dto: DownloadContentFileDto = {
      directoryId,
      idToDownload,
      loggedUserId,
    };

    const result = await this.downloadContentFileService.download(dto);

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
