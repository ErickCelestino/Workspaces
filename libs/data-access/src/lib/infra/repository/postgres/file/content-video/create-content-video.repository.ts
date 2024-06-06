import { Inject } from '@nestjs/common';
import {
  CreateContentVideoDto,
  CreateContentVideoRepository,
} from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class CreateContentVideoRepositoryImpl
  implements CreateContentVideoRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async create(input: CreateContentVideoDto): Promise<string[]> {
    let idList = [];
    for (let i = 0; i < input.file.length; i++) {
      const createdContentVideo = await this.prismaService.content_Files.create(
        {
          data: {
            name: input.file[i].originalname,
            format: input.file[i].mimetype,
            size: input.file[i].size.toString(),
            user_id: input.loggedUserId,
            file_url: 'a criar',
            directory_id: input.directoryId,
          },
        }
      );

      idList.push(createdContentVideo.Content_Files_id);
    }

    return idList;
  }
}
