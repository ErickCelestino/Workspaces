import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { EditPlaylistCategoryService } from './edit-playlist-category.service';
import { PlaylistCategoryBodyDto } from '@workspaces/domain';

@Controller('edit-playlist-category')
export class EditPlaylistCategoryController {
  constructor(
    private readonly editPlaylistCategoryService: EditPlaylistCategoryService
  ) {}

  @Put(':id')
  async edit(
    @Param('id') idToEdit: string,
    @Query('loggedUserId') loggedUserId: string,
    @Body() body: PlaylistCategoryBodyDto
  ) {
    const result = await this.editPlaylistCategoryService.edit({
      id: idToEdit,
      name: body.name,
      description: body.description,
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
