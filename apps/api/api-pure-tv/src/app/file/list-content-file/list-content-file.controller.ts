import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UsePipes,
} from '@nestjs/common';
import { ListContentFileService } from './list-content-file.service';
import { ListContentFileDto, listContentFileSchema } from '@workspaces/domain';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';

@Controller('list-content-file')
export class ListContentFileController {
  constructor(
    private readonly listContentFileService: ListContentFileService
  ) {}

  @UsePipes(
    new ZodValidationPipe({
      loggedUserId: listContentFileSchema.loggedUserId,
      directoryId: listContentFileSchema.directoryId,
      filter: listContentFileSchema.filter,
      take: listContentFileSchema.take,
      skip: listContentFileSchema.skip,
    })
  )
  @Get()
  async list(
    @Query('filter') filter: string,
    @Query('skip') skip: number,
    @Query('take') take: number,
    @Query('loggedUserId') loggedUserId: string,
    @Query('directoryId') directoryId: string
  ) {
    const dto: ListContentFileDto = {
      directoryId,
      loggedUserId,
      userInput: filter,
      skip: skip,
      take: take,
    };

    const result = await this.listContentFileService.list(dto);

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
