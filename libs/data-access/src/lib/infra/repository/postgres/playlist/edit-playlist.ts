import { Inject } from '@nestjs/common';
import { EditPlaylistDto, EditPlaylistRepository } from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class EditPlaylistRepositoryImpl implements EditPlaylistRepository {
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async edit(input: EditPlaylistDto): Promise<void> {
    const { id, body } = input;

    await this.prismaService.playlist.update({
      where: {
        playlist_id: id,
      },
      data: {
        name: body.name,
        category_id: body.playlistCategoryId,
      },
    });
  }
}
