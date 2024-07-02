import {
  BadRequestException,
  Controller,
  Delete,
  Param,
  Query,
} from '@nestjs/common';
import { DeletePlaylistCategoryService } from './delete-playlist-category.service';

@Controller('delete-playlist-category')
export class DeletePlaylistCategoryController {
  constructor(
    private readonly deletePlaylistCategoryService: DeletePlaylistCategoryService
  ) {}

  @Delete(':id')
  async delete(
    @Param('id') idToDelete: string,
    @Query('loggedUserId') loggedUserId: string
  ) {
    const result = await this.deletePlaylistCategoryService.delete({
      id: idToDelete,
      loggedUserId,
    });

    if (result.isRight()) return { playlistCategoryId: result.value };
    else
      throw new BadRequestException({
        error: {
          name: result.value.name,
          message: result.value.message,
        },
      });
  }
}
