import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { DetailsContentFileService } from './details-content-file.service';
import { DetailsContentFileDto } from '@workspaces/domain';

@Controller('details-content-file')
export class DetailsContentFileController {
  constructor(
    private readonly detailsContentFileService: DetailsContentFileService
  ) {}

  @Get(':id')
  async details(
    @Param('id') id: string,
    @Query('loggedUserId') loggedUserId: string,
    @Query('directoryId') directoryId: string
  ) {
    const dto: DetailsContentFileDto = {
      directoryId,
      loggedUserId,
      id,
    };

    const result = await this.detailsContentFileService.details(dto);

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
