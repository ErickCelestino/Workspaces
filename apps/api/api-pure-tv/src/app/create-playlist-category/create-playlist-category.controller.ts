import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import { CreatePlaylistCategoryService } from './create-playlist-category.service';
import {
  PlaylistCategoryBodyDto,
  createPlaylistCategorySchema,
} from '@workspaces/domain';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';

@Controller('create-playlist-category')
export class CreatePlaylistCategoryController {
  constructor(
    private readonly createPlaylistCategoryService: CreatePlaylistCategoryService
  ) {}

  @UsePipes(new ZodValidationPipe(createPlaylistCategorySchema))
  @Post()
  async create(
    @Query('loggedUserId') loggedUserId: string,
    @Body() body: PlaylistCategoryBodyDto
  ) {
    const result = await this.createPlaylistCategoryService.create({
      body,
      loggedUserId,
    });

    if (result.isRight()) return { playlistCategoryId: result.value };
    else
      throw new BadRequestException({
        error: {
          name: result.value.name,
          message: result.value.message,
        },
      });
  }
}
