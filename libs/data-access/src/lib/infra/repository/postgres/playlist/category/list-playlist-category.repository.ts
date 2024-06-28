import { Inject } from '@nestjs/common';
import {
  ListPlaylistCategoryDto,
  ListPlaylistCategoryReponseDto,
  ListPlaylistCategoryRepository,
  PlaylistCategory,
} from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class ListPlaylistCategoryRepositoryImpl
  implements ListPlaylistCategoryRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async list(
    input: ListPlaylistCategoryDto
  ): Promise<ListPlaylistCategoryReponseDto> {
    const { loggedUserId, userInput } = input;

    const skip = input?.skip || 0;
    const take = input?.take || 6;

    const whereClause = {
      user_id: loggedUserId,
      ...(userInput !== ''
        ? {
            name: {
              contains: userInput,
              mode: 'insensitive' as 'insensitive',
            },
          }
        : {}),
    };

    const [categories, filteredTotal, total] =
      await this.prismaService.$transaction([
        this.prismaService.playlist_Category.findMany({
          where: whereClause,
          select: {
            playlist_category_id: true,
            created_at: true,
            name: true,
            description: true,
            user: {
              select: {
                nick_name: true,
              },
            },
          },
          skip: parseInt(skip.toString()),
          take: parseInt(take.toString()),
        }),
        this.prismaService.playlist_Category.count({
          where: whereClause,
        }),
        this.prismaService.playlist_Category.count({
          where: {
            user_id: loggedUserId,
          },
        }),
      ]);
    const totalPages = Math.ceil(filteredTotal / take);
    const mappedCategories: PlaylistCategory[] = categories.map((category) => {
      return {
        id: category.playlist_category_id,
        created_at: category.created_at,
        created_by: category.user.nick_name,
        description: category.description,
        name: category.name,
      };
    });

    return {
      categories: mappedCategories,
      filteredTotal,
      totalPages,
      total,
    };
  }
}
