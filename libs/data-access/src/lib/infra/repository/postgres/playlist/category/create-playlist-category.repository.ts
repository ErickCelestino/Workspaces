import { Inject } from '@nestjs/common';
import {
  CreatePlaylistCategoryDto,
  CreatePlaylistCategoryRepository,
} from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class CreatePlaylistCategoryRepositoryImpl
  implements CreatePlaylistCategoryRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async create(input: CreatePlaylistCategoryDto): Promise<string> {
    const { loggedUserId, name, description } = input;

    const createdPlaylist = await this.prismaService.playlist_Category.create({
      data: {
        name,
        description,
        user_id: loggedUserId,
      },
    });

    return createdPlaylist.playlist_category_id;
  }
}
