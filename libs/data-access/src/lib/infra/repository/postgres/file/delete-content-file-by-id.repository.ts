import { Inject } from '@nestjs/common';
import {
  DeleteContentFileByIdDto,
  DeleteContentFileByIdRepository,
} from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class DeleteContentFileByIdRepositoryImpl
  implements DeleteContentFileByIdRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async delete(input: DeleteContentFileByIdDto): Promise<void> {
    await this.prismaService.content_Files.delete({
      where: {
        Content_Files_id: input.idToDelete,
      },
    });
  }
}
