import { Inject } from '@nestjs/common';
import { FindPlaylistByIdRepository, Playlist } from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class FindPlaylistByIdRepositoryImpl
  implements FindPlaylistByIdRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async find(id: string): Promise<Playlist> {
    const filteredPlaylist = await this.prismaService.playlist.findFirst({
      where: {
        playlist_id: id,
      },
      select: {
        playlist_id: true,
        name: true,
        created_at: true,
        category: {
          select: {
            name: true,
          },
        },
        user: {
          select: {
            nick_name: true,
          },
        },
      },
    });

    return {
      category: filteredPlaylist?.category.name ?? '',
      created_at: filteredPlaylist?.created_at ?? new Date(),
      created_by: filteredPlaylist?.user.nick_name ?? '',
      id: filteredPlaylist?.playlist_id ?? '',
      name: filteredPlaylist?.name ?? '',
    };
  }
}
