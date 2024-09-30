import { Inject } from '@nestjs/common';
import {
  CreatePlaylistCategoryDto,
  CreatePlaylistCategoryRepository,
} from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class CreatePlaylistCategoryRepositoryImpl
  implements CreatePlaylistCategoryRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async create(input: CreatePlaylistCategoryDto): Promise<string> {
    const { loggedUserId, companyId, body } = input;

    const createdPlaylist = await this.prismaService.playlist_Category.create({
      data: {
        name: body.name,
        description: body.description,
        user_id: loggedUserId,
        company_id: companyId,
      },
    });

    return createdPlaylist.playlist_category_id;
  }
}
