import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
  UsePipes,
} from '@nestjs/common';
import { DetailsContentFileService } from './details-content-file.service';
import {
  DetailsContentFileDto,
  detailsContentFileSchema,
} from '@workspaces/domain';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';

@Controller('details-content-file')
export class DetailsContentFileController {
  constructor(
    private readonly detailsContentFileService: DetailsContentFileService
  ) {}

  @UsePipes(
    new ZodValidationPipe({
      id: detailsContentFileSchema.id,
      loggedUserId: detailsContentFileSchema.loggedUserId,
      directoryId: detailsContentFileSchema.directoryId,
    })
  )
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
