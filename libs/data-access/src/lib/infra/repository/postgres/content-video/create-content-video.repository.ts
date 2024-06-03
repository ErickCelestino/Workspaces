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
  async create(input: CreateContentVideoDto): Promise<void> {
    const createdContentVideo = await this.prismaService.content_Video.create({
      data: {
        name: input.name,
        duration: input.duration,
        format: input.format,
        resolution: input.resolution,
        size: input.size,
        user_id: input.loggedUserId,
        video_url: 'aa',
        directory_id: input.directoryId,
      },
    });
  }
}
