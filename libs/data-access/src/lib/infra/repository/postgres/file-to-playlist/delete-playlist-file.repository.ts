import { Inject } from '@nestjs/common';
import {
  DeletePlaylistFileDto,
  DeletePlaylistFileRepository,
} from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class DeletePlaylistFileRepositoryImpl
  implements DeletePlaylistFileRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async delete(input: DeletePlaylistFileDto): Promise<void> {
    const { playlistId, fileId } = input;

    await this.prismaService.playlist_X_Content_Files.deleteMany({
      where: {
        playlist_id: playlistId,
        Content_Files_id: fileId,
      },
    });
  }
}
