import { Inject } from '@nestjs/common';
import {
  FindPlaylistByNameDto,
  FindPlaylistByNameRepository,
  Playlist,
} from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class FindPlaylistByNameRepositoryImpl
  implements FindPlaylistByNameRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async find(input: FindPlaylistByNameDto): Promise<Playlist> {
    const { loggedUserId, name } = input;
    const playlistResult = await this.prismaService.playlist.findFirst({
      where: {
        name,
        user_id: loggedUserId,
      },
      select: {
        playlist_id: true,
        category: {
          select: {
            name: true,
          },
        },
        created_at: true,
        name: true,
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    const mappedPlaylist: Playlist = {
      category: playlistResult?.category.name ?? '',
      created_at: playlistResult?.created_at ?? new Date(),
      created_by: playlistResult?.user.name ?? '',
      id: playlistResult?.playlist_id ?? '',
      name: playlistResult?.name ?? '',
    };

    return mappedPlaylist;
  }
}
