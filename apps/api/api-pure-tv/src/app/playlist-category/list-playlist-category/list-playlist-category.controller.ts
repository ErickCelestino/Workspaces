import { Controller, Get, Query, UsePipes } from '@nestjs/common';
import { ListPlaylistCategoryService } from './list-playlist-category.service';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import {
  ErrorMessageResult,
  listPlaylistCategorySchema,
} from '@workspaces/domain';

@Controller('list-playlist-category')
export class ListPlaylistCategoryController {
  constructor(
    private readonly listPlaylistCategoryService: ListPlaylistCategoryService
  ) {}

  @UsePipes(new ZodValidationPipe(listPlaylistCategorySchema))
  @Get()
  async list(
    @Query('filter') filter: string,
    @Query('skip') skip: number,
    @Query('take') take: number,
    @Query('loggedUserId') loggedUserId: string
  ) {
    const result = await this.listPlaylistCategoryService.list({
      loggedUserId,
      userInput: filter,
      skip,
      take,
    });

    if (result.isRight()) return result.value;
    else ErrorMessageResult(result.value.name, result.value.message);
  }
}
