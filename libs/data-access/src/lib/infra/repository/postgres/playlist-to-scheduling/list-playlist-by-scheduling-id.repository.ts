import { Inject } from '@nestjs/common';
import {
  ListPlaylistBySchedulingIdDto,
  ListPlaylistBySchedulingIdRepository,
  ListPlaylistReponseDto,
  Playlist,
} from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class ListPlaylistBySchedulingIdRepositoryImpl
  implements ListPlaylistBySchedulingIdRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async list(
    input: ListPlaylistBySchedulingIdDto
  ): Promise<ListPlaylistReponseDto> {
    const { filter, id } = input;

    const skip = input?.skip || 0;
    const take = input?.take || 6;

    const whereClause = {
      scheduling_id: id,
      ...(filter !== ''
        ? {
            playlist: {
              name: {
                contains: filter,
                mode: 'insensitive' as const,
              },
            },
          }
        : {}),
    };

    const [playlists, filteredTotal, total] =
      await this.prismaService.$transaction([
        this.prismaService.playlist_X_Scheduling.findMany({
          where: whereClause,
          select: {
            created_at: true,
            playlist: {
              select: {
                playlist_id: true,
                created_at: true,
                name: true,
                user: {
                  select: {
                    nick_name: true,
                  },
                },
                category: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
          skip: parseInt(skip.toString()),
          take: parseInt(take.toString()),
        }),
        this.prismaService.playlist_X_Scheduling.count({
          where: whereClause,
        }),
        this.prismaService.playlist_X_Scheduling.count({
          where: {
            scheduling_id: id,
          },
        }),
      ]);

    const totalPages = Math.ceil(filteredTotal / take);

    const mappedPlaylist: Playlist[] = playlists.map((item) => {
      return {
        category: item.playlist.category.name,
        created_at: item.playlist.created_at,
        created_by: item.playlist.user.nick_name,
        id: item.playlist.playlist_id,
        name: item.playlist.name,
      };
    });

    return {
      filteredTotal,
      total,
      totalPages,
      playlists: mappedPlaylist,
    };
  }
}
