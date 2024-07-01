import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { FindPlaylistCategoryByIdService } from './find-playlist-category-by-id.service';

@Controller('find-playlist-category-by-id')
export class FindPlaylistCategoryByIdController {
  constructor(
    private readonly findPlaylistCategoryByIdService: FindPlaylistCategoryByIdService
  ) {}

  @Get(':id')
  async find(
    @Param('id') id: string,
    @Query('loggedUserId') loggedUserId: string
  ) {
    const result = await this.findPlaylistCategoryByIdService.find({
      id,
      loggedUserId,
    });

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
