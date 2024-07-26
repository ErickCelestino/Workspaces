import { Controller, Delete, Param, Query } from '@nestjs/common';
import { DeletePlaylistToSchedulingService } from './delete-playlist-to-scheduling.service';
import { ErrorMessageResult } from '@workspaces/domain';

@Controller('delete-playlist-to-scheduling')
export class DeletePlaylistToSchedulingController {
  constructor(
    private readonly deletePlaylistToSchedulingService: DeletePlaylistToSchedulingService
  ) {}

  @Delete(':id')
  async delete(
    @Param('id') playlistId: string,
    @Query('schedulingId') schedulingId: string,
    @Query('loggedUserId') loggedUserId: string
  ) {
    const result = await this.deletePlaylistToSchedulingService.delete({
      loggedUserId,
      playlistId,
      schedulingId,
    });

    if (result.isRight()) return result.value;
    else await ErrorMessageResult(result.value.name, result.value.message);
  }
}
