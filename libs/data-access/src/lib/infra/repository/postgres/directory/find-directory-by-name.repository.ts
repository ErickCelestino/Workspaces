import { Inject } from '@nestjs/common';
import {
  Directory,
  FindDirectoryByNameDto,
  FindDirectoryByNameRepository,
} from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class FindDirectoryByNameRepositoryImpl
  implements FindDirectoryByNameRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}

  async find(input: FindDirectoryByNameDto): Promise<Directory | object> {
    const filteredDirectory = await this.prismaService.directory.findFirst({
      where: {
        AND: [{ name: input.name }, { user_id: input.loggedUserId }],
      },
      select: {
        name: true,
        directory_id: true,
      },
    });

    if (!filteredDirectory) {
      return {};
    }

    const mappedDirectory: Directory = {
      id: filteredDirectory?.directory_id ?? '',
      name: filteredDirectory?.name ?? '',
    };
    return mappedDirectory;
  }
}
