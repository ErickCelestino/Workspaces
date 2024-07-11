import { Inject } from '@nestjs/common';
import { FindFileInFileToPlaylistRepository } from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class FindFileInFileToPlaylistRepositoryImpl
  implements FindFileInFileToPlaylistRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async find(id: string): Promise<string> {
    const filteredFile =
      await this.prismaService.playlist_X_Content_Files.findFirst({
        where: {
          Content_Files_id: id,
        },
      });

    return filteredFile?.Content_Files_id ?? '';
  }
}
