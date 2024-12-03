import { Inject } from '@nestjs/common';
import {
  MoveFileToDirectoryDto,
  MoveFileToDirectoryRepository,
} from '@workspaces/domain';
import { PrismaService } from '../../../../application';

export class MoveFileToDirectoryRepositoryImpl
  implements MoveFileToDirectoryRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async move(input: MoveFileToDirectoryDto): Promise<void> {
    const { idToMove, idToMoveDirectory } = input;

    await this.prismaService.generalPrisma.content_Files.update({
      where: {
        Content_Files_id: idToMove,
      },
      data: {
        directory_id: idToMoveDirectory,
      },
    });
  }
}
