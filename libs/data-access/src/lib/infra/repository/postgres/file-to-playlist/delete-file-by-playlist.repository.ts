import { Inject } from '@nestjs/common';
import { DeleteFileByPlaylistRepository } from '@workspaces/domain';
import { PrismaService } from '../../../../application';

export class DeleteFileByPlaylistRepositoryImpl
  implements DeleteFileByPlaylistRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async delete(idPlaylist: string): Promise<void> {
    await this.prismaService.generalPrisma.playlist_X_Content_Files.deleteMany({
      where: {
        playlist_id: idPlaylist,
      },
    });
  }
}
