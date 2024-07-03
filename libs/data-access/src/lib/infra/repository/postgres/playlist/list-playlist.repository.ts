import { Inject } from '@nestjs/common';
import {
  ListPlaylistDto,
  ListPlaylistReponseDto,
  ListPlaylistRepository,
  Playlist,
} from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class ListPlaylistRepositoryImpl implements ListPlaylistRepository {
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async list(input: ListPlaylistDto): Promise<ListPlaylistReponseDto> {
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

    const [playlists, filteredTotal, total] =
      await this.prismaService.$transaction([
        this.prismaService.playlist.findMany({
          where: whereClause,
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

    const mappedPlaylist: Playlist[] = playlists.map((playlist) => {
      return {
        category: playlist.category.name,
        created_at: playlist.created_at,
        created_by: playlist.user.nick_name,
        id: playlist.playlist_id,
        name: playlist.name,
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
