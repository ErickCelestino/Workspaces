import { Inject } from '@nestjs/common';
import { DeletePlaylistRepoistory } from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class DeletePlaylistRepositoryImpl implements DeletePlaylistRepoistory {
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async delete(id: string): Promise<void> {
    await this.prismaService.playlist_X_Scheduling.deleteMany({
      where: {
        playlist_id: id,
      },
    });

    await this.prismaService.playlist_X_Content_Files.deleteMany({
      where: {
        playlist_id: id,
      },
    });

    await this.prismaService.playlist.delete({
      where: {
        playlist_id: id,
      },
    });
  }
}
