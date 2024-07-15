import { Controller, Get, Param, Query } from '@nestjs/common';
import { FindFilesByPlaylistService } from './find-files-by-playlist.service';
import { ErrorMessageResult } from '@workspaces/domain';

@Controller('find-files-by-playlist')
export class FindFilesByPlaylistController {
  constructor(
    private readonly findFilesByPlaylistService: FindFilesByPlaylistService
  ) {}

  @Get(':playlistId')
  async find(
    @Param('playlistId') playlistId: string,
    @Query('skip') skip: number,
    @Query('take') take: number,
    @Query('loggedUserId') loggedUserId: string
  ) {
    const result = await this.findFilesByPlaylistService.find({
      idPlaylist: playlistId,
      loggedUserId,
      skip,
      take,
    });

    if (result.isRight()) return result.value;
    else ErrorMessageResult(result.value.name, result.value.message);
  }
}
