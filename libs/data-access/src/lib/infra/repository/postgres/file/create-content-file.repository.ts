import { Inject } from '@nestjs/common';
import {
  CreateContentFileDto,
  CreateContentFileRepository,
} from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class CreateContentFileRepositoryImpl
  implements CreateContentFileRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async create(input: CreateContentFileDto): Promise<string[]> {
    const idList = [];
    for (const file of input.file) {
      const createdContentVideo = await this.prismaService.content_Files.create(
        {
          data: {
            original_name: file.originalname.split('.')[0],
            format: file.mimetype,
            size: file.size.toString(),
            user_id: input.loggedUserId,
            path: file.path,
            directory_id: input.directoryId,
            file_name: file.filename,
          },
        }
      );

      idList.push(createdContentVideo.Content_Files_id);
    }

    return idList;
  }
}
