import {
  BadRequestException,
  Controller,
  Delete,
  Param,
  Query,
} from '@nestjs/common';
import { DeletePlaylistService } from './delete-playlist.service';

@Controller('delete-playlist')
export class DeletePlaylistController {
  constructor(private readonly deletePlaylistService: DeletePlaylistService) {}

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @Query('loggedUserId') loggedUserId: string
  ) {
    const result = await this.deletePlaylistService.delete({
      id,
      loggedUserId,
    });

    if (result.isRight()) return { playlistId: result.value };
    else
      throw new BadRequestException({
        error: {
          name: result.value.name,
          message: result.value.message,
        },
      });
  }
}
