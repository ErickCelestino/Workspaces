import { Inject } from '@nestjs/common';
import {
  EditPlaylistCategoryDto,
  EditPlaylistCategoryRepository,
} from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class EditPlaylistCategoryRepositoryImpl
  implements EditPlaylistCategoryRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async edit(input: EditPlaylistCategoryDto): Promise<void> {
    const { id, body } = input;

    await this.prismaService.playlist_Category.update({
      where: {
        playlist_category_id: id,
      },
      data: {
        name: body.name,
        description: body.description,
        updated_at: new Date(),
      },
    });
  }
}
