import { Inject } from '@nestjs/common';
import {
  DeleteDirectoryDto,
  DeleteDirectoryRepository,
} from '@workspaces/domain';
import { PrismaService } from '../../../../application';

export class DeleteDirectoryRepositoryImpl
  implements DeleteDirectoryRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async delete(input: DeleteDirectoryDto): Promise<void> {
    const { id } = input;

    await this.prismaService.generalPrisma.directory.delete({
      where: {
        directory_id: id,
      },
    });
  }
}
