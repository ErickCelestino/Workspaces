import { Body, Controller, Post, Query } from '@nestjs/common';
import { AddFileToPlaylistService } from './add-file-to-playlist.service';
import { ErrorMessageResult } from '@workspaces/domain';

@Controller('add-file-to-playlist')
export class AddFileToPlaylistController {
  constructor(
    private readonly addFileToPlaylistService: AddFileToPlaylistService
  ) {}

  @Post()
  async add(
    @Query('loggedUserId') loggedUserId: string,
    @Body() body: { filesId: string[] },
    @Query('playlistId') playlistId: string
  ) {
    const result = await this.addFileToPlaylistService.add({
      filesId: body.filesId,
      loggedUserId,
      playlistId,
    });

    if (result.isRight()) return result.value;
    else ErrorMessageResult(result.value.name, result.value.message);
  }
}
