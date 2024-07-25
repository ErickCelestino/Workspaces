import { Controller, Get, Param, Query } from '@nestjs/common';
import { ListPlaylistBySchedulingIdService } from './list-playlist-by-scheduling-id.service';
import { ErrorMessageResult } from '@workspaces/domain';

@Controller('list-playlist-by-scheduling-id')
export class ListPlaylistBySchedulingIdController {
  constructor(
    private readonly listPlaylistBySchedulingIdService: ListPlaylistBySchedulingIdService
  ) {}

  @Get(':id')
  async list(
    @Param('id') id: string,
    @Query('loggedUserId') loggedUserId: string,
    @Query('filter') filter: string,
    @Query('skip') skip: number,
    @Query('take') take: number
  ) {
    const result = await this.listPlaylistBySchedulingIdService.list({
      id,
      loggedUserId,
      filter,
      skip,
      take,
    });

    if (result.isRight()) return result.value;
    else await ErrorMessageResult(result.value.name, result.value.message);
  }
}
