import { Body, Controller, Post, Query } from '@nestjs/common';
import { AddPlaylistsToSchedulingService } from './add-playlists-to-scheduling.service';
import { ErrorMessageResult } from '@workspaces/domain';

@Controller('add-playlists-to-scheduling')
export class AddPlaylistsToSchedulingController {
  constructor(
    private readonly addPlaylistsToSchedulingService: AddPlaylistsToSchedulingService
  ) {}

  @Post()
  async add(
    @Query('loggedUserId') loggedUserId: string,
    @Body() body: { playlistIds: string[] },
    @Query('schedulingId') schedulingId: string
  ) {
    const result = await this.addPlaylistsToSchedulingService.add({
      loggedUserId,
      playlistIds: body.playlistIds,
      schedulingId,
    });

    if (result.isRight()) return result.value;
    else await ErrorMessageResult(result.value.name, result.value.message);
  }
}
