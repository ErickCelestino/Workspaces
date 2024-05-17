import { Inject } from '@nestjs/common';
import {
  DeleteUserByIdDto,
  DeleteUserByIdRepository,
} from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class DeleteUserByIdRepositoryImpl implements DeleteUserByIdRepository {
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async delete(input: DeleteUserByIdDto): Promise<void> {
    await this.prismaService.user.delete({
      where: {
        user_id: input.id,
      },
    });
  }
}
