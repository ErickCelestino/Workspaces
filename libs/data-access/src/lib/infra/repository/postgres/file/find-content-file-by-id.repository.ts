import { Inject } from '@nestjs/common';
import { ContentFile, FindContentFileByIdRepository } from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class FindContentFileByIdRepositoryImpl
  implements FindContentFileByIdRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async find(id: string): Promise<ContentFile> {
    const contentFileResult = await this.prismaService.content_Files.findFirst({
      where: {
        Content_Files_id: id,
      },
      select: {
        Content_Files_id: true,
        size: true,
        format: true,
        upload_date: true,
        file_name: true,
        path: true,
        original_name: true,
        user: {
          select: {
            nick_name: true,
          },
        },
      },
    });

    const mappedContentFile: ContentFile = {
      id: contentFileResult?.Content_Files_id ?? '',
      created_by: contentFileResult?.user.nick_name ?? '',
      fileName: contentFileResult?.file_name ?? '',
      format: contentFileResult?.format ?? '',
      originalName: contentFileResult?.original_name ?? '',
      path: contentFileResult?.path ?? '',
      size: contentFileResult?.size ?? '',
      uploadDate: contentFileResult?.upload_date ?? new Date(),
    };

    return mappedContentFile;
  }
}
