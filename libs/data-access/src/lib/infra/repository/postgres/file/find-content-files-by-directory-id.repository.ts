import { Inject } from '@nestjs/common';
import {
  ContentFile,
  FindContentFilesByDirectoryIdRepository,
} from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class FindContentFilesByDirectoryIdRepositoryImpl
  implements FindContentFilesByDirectoryIdRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async find(id: string): Promise<ContentFile[]> {
    const filteredFiles = await this.prismaService.content_Files.findMany({
      where: {
        directory_id: id,
      },
      select: {
        Content_Files_id: true,
        size: true,
        format: true,
        upload_date: true,
        file_name: true,
        path: true,
        original_name: true,
        thumbnail: true,
        user: {
          select: {
            nick_name: true,
          },
        },
      },
    });

    const mappedContentFiles: ContentFile[] = filteredFiles.map((file) => {
      return {
        id: file?.Content_Files_id ?? '',
        fileName: file?.file_name ?? '',
        format: file?.format ?? '',
        originalName: file?.original_name ?? '',
        path: file?.path ?? '',
        size: file?.size ?? '',
        uploadDate: file?.upload_date ?? '',
        created_by: file?.user?.nick_name ?? '',
        thumbnail: file.thumbnail ?? '',
      };
    });

    return mappedContentFiles;
  }
}
