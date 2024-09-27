import { Inject } from '@nestjs/common';
import { EditDirectoryDto, EditDirectoryRepository } from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class EditDirectoryRepositoryImpl implements EditDirectoryRepository {
  constructor(
    @Inject('PrismaService')
    private prismaService: PrismaService
  ) {}

  async edit(input: EditDirectoryDto): Promise<string> {
    const { id, newName } = input;

    const editedDirectory = await this.prismaService.directory.update({
      where: {
        directory_id: id,
      },
      data: {
        name: newName,
      },
    });

    return editedDirectory.directory_id;
  }
}
