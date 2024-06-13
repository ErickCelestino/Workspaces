import { Inject } from '@nestjs/common';
import {
  ContentFile,
  ListContentFileDto,
  ListContentFileRepository,
} from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class ListContentFileRepositoryImpl
  implements ListContentFileRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async list(input: ListContentFileDto): Promise<ContentFile[]> {
    const resultList = await this.prismaService.content_Files.findMany({
      where: {
        ...(input.userInput !== null
          ? {
              original_name: { contains: input.userInput, mode: 'insensitive' },
            }
          : {}),
      },
      select: {
        Content_Files_id: true,
        size: true,
        format: true,
        upload_date: true,
        file_name: true,
        path: true,
        original_name: true,
      },
    });

    const mappedContentFiles: ContentFile[] = resultList.map((item) => {
      return {
        id: item.Content_Files_id,
        fileName: item.file_name,
        format: item.format,
        originalName: item.original_name,
        path: item.path,
        size: item.size,
        uploadDate: item.upload_date,
      };
    });

    return mappedContentFiles;
  }
}
