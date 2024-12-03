import { Inject } from '@nestjs/common';
import { EditDirectoryDto, EditDirectoryRepository } from '@workspaces/domain';
import { PrismaService } from '../../../../application';

export class EditDirectoryRepositoryImpl implements EditDirectoryRepository {
  constructor(
    @Inject('PrismaService')
    private prismaService: PrismaService
  ) {}

  async edit(input: EditDirectoryDto): Promise<string> {
    const { id, newName } = input;

    const editedDirectory =
      await this.prismaService.generalPrisma.directory.update({
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
