import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UsePipes,
} from '@nestjs/common';
import { ListPlaylistService } from './list-playlist.service';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { listPlaylistSchema } from '@workspaces/domain';

@Controller('list-playlist')
export class ListPlaylistController {
  constructor(private readonly listPlaylistService: ListPlaylistService) {}

  @UsePipes(new ZodValidationPipe(listPlaylistSchema))
  @Get()
  async list(
    @Query('filter') filter: string,
    @Query('skip') skip: number,
    @Query('take') take: number,
    @Query('loggedUserId') loggedUserId: string
  ) {
    const result = await this.listPlaylistService.list({
      loggedUserId,
      userInput: filter,
      skip,
      take,
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
