import { Inject } from '@nestjs/common';
import {
  CreateContentFileRepository,
  RegisterContentFileDto,
} from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class CreateContentFileRepositoryImpl
  implements CreateContentFileRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async create(input: RegisterContentFileDto): Promise<string> {
    const { file, loggedUserId, directoryId, thumbnail, companyId } = input;
    const createdContentVideo = await this.prismaService.content_Files.create({
      data: {
        original_name: file.originalname.split('.')[0],
        format: file.mimetype,
        size: file.size.toString(),
        user_id: loggedUserId,
        path: file.path,
        directory_id: directoryId,
        file_name: file.filename,
        thumbnail,
        company_id: companyId,
      },
    });
    return createdContentVideo.Content_Files_id;
  }
}
