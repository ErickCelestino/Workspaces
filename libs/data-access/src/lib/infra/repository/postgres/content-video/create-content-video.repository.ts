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
  async create(input: CreateContentVideoDto): Promise<string> {
    const createdContentVideo = await this.prismaService.content_Video.create({
      data: {
        name: 'a criar',
        duration: 'a criar',
        format: 'a criar',
        resolution: 'a criar',
        size: 'a criar',
        user_id: input.loggedUserId,
        video_url: 'a criar',
        directory_id: input.directoryId,
      },
    });

    return createdContentVideo.content_video_id;
  }
}
