import { Inject } from '@nestjs/common';
import { DeletePlaylistCategoryRepository } from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class DeletePlaylistCategoryRepositoryImpl
  implements DeletePlaylistCategoryRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async delete(id: string): Promise<void> {
    await this.prismaService.playlist_Category.delete({
      where: {
        playlist_category_id: id,
      },
    });
  }
}
