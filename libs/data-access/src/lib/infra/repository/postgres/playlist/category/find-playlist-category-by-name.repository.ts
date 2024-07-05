import { Inject } from '@nestjs/common';
import {
  FindPlaylistCategoryByNameDto,
  FindPlaylistCategoryByNameRepository,
  PlaylistCategory,
} from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class FindPlaylistCategoryByNameRepositoryImpl
  implements FindPlaylistCategoryByNameRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async find(input: FindPlaylistCategoryByNameDto): Promise<PlaylistCategory> {
    const { loggedUserId, name } = input;

    const filteredPlaylistCategory =
      await this.prismaService.playlist_Category.findFirst({
        where: {
          user_id: loggedUserId,
          name: name,
        },
        select: {
          name: true,
          created_at: true,
          description: true,
          playlist_category_id: true,
          user: {
            select: {
              nick_name: true,
            },
          },
        },
      });

    return {
      id: filteredPlaylistCategory?.playlist_category_id ?? '',
      name: filteredPlaylistCategory?.name ?? '',
      created_at: filteredPlaylistCategory?.created_at ?? new Date(),
      created_by: filteredPlaylistCategory?.user.nick_name ?? '',
      description: filteredPlaylistCategory?.description ?? '',
    };
  }
}
