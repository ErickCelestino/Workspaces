import { Controller, Delete, Param, Query, UsePipes } from '@nestjs/common';
import { DeletePlaylistService } from './delete-playlist.service';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { deletePlaylistSchema, ErrorMessageResult } from '@workspaces/domain';

@Controller('delete-playlist')
export class DeletePlaylistController {
  constructor(private readonly deletePlaylistService: DeletePlaylistService) {}

  @UsePipes(new ZodValidationPipe(deletePlaylistSchema))
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
    else ErrorMessageResult(result.value.name, result.value.message);
  }
}
