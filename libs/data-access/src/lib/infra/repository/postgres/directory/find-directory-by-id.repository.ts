import { Inject } from '@nestjs/common';
import { Directory, FindDirectoryByIdRepository } from '@workspaces/domain';
import { PrismaService } from '../../../../application';

export class FindDirectoryByIdRepositoryImpl
  implements FindDirectoryByIdRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async find(id: string): Promise<Directory> {
    const filteredDirectory =
      await this.prismaService.generalPrisma.directory.findFirst({
        where: {
          directory_id: id,
        },
        select: {
          name: true,
          directory_id: true,
        },
      });

    const mappedDirectory: Directory = {
      id: filteredDirectory?.directory_id ?? '',
      name: filteredDirectory?.name ?? '',
    };

    return mappedDirectory;
  }
}
