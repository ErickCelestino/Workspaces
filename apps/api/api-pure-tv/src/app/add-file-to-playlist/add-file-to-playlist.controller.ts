import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Query,
} from '@nestjs/common';
import { AddFileToPlaylistService } from './add-file-to-playlist.service';

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
    console.log(body.filesId);
    const result = await this.addFileToPlaylistService.add({
      filesId: body.filesId,
      loggedUserId,
      playlistId,
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
