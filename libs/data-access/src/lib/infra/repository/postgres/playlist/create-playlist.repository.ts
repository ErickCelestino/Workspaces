import { Inject } from '@nestjs/common';
import {
  CreatePlaylistDto,
  CreatePlaylistRepository,
} from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class CreatePlaylistRepositoryImpl implements CreatePlaylistRepository {
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async create(input: CreatePlaylistDto): Promise<string> {
    const { loggedUserId, playlistCategoryId, name } = input;
    const playlistResult = await this.prismaService.playlist.create({
      data: {
        user_id: loggedUserId,
        category_id: playlistCategoryId,
        name,
      },
    });

    return playlistResult.playlist_id;
  }
}
