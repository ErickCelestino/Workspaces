import { Inject } from '@nestjs/common';
import {
  EditPlaylistCategoryDto,
  EditPlaylistCategoryRepository,
} from '@workspaces/domain';
import { PrismaService } from '../../../../../application';

export class EditPlaylistCategoryRepositoryImpl
  implements EditPlaylistCategoryRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async edit(input: EditPlaylistCategoryDto): Promise<void> {
    const { id, body } = input;

    await this.prismaService.generalPrisma.playlist_Category.update({
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
