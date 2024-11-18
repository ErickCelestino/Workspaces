import { Inject } from '@nestjs/common';
import {
  FindFileInFileToPlaylistDto,
  FindFileInFileToPlaylistRepository,
} from '@workspaces/domain';
import { PrismaService } from '../../../../application';

export class FindFileInFileToPlaylistRepositoryImpl
  implements FindFileInFileToPlaylistRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async find(input: FindFileInFileToPlaylistDto): Promise<string> {
    const filteredFile =
      await this.prismaService.generalPrisma.playlist_X_Content_Files.findFirst(
        {
          where: {
            Content_Files_id: input.fileId,
            playlist_id: input.playlsitId,
          },
        }
      );

    return filteredFile?.Content_Files_id ?? '';
  }
}
