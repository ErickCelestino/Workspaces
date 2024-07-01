import { Inject } from '@nestjs/common';
import {
  FindPlaylistCategoryByIdRepository,
  PlaylistCategory,
} from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class FindPlaylistCategoryRepositoryImpl
  implements FindPlaylistCategoryByIdRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async find(id: string): Promise<PlaylistCategory> {
    const playlistCategoryResult =
      await this.prismaService.playlist_Category.findFirst({
        where: {
          playlist_category_id: id,
        },
        select: {
          playlist_category_id: true,
          name: true,
          description: true,
          created_at: true,
          user: {
            select: {
              user_id: true,
            },
          },
        },
      });

    const mappedPlaylistCategory: PlaylistCategory = {
      id: playlistCategoryResult?.playlist_category_id ?? '',
      name: playlistCategoryResult?.name ?? '',
      description: playlistCategoryResult?.description ?? '',
      created_at: playlistCategoryResult?.created_at ?? new Date(),
      created_by: playlistCategoryResult?.user.user_id ?? '',
    };

    return mappedPlaylistCategory;
  }
}
