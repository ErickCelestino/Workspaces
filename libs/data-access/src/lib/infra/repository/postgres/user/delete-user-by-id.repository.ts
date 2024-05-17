import { Inject } from '@nestjs/common';
import {
  DeleteUserByIdDto,
  DeleteUserByIdRepository,
} from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class DeleteUserByIdRepositoryImpl implements DeleteUserByIdRepository {
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async delete(input: DeleteUserByIdDto): Promise<void> {
    await this.prismaService.confirmDeleteUser.create({
      data: {
        user_id: input.id,
        description: input.description,
        responsibly_user: input.loggedUser,
      },
    });

    await this.prismaService.user.update({
      where: {
        user_id: input.id,
      },
      data: {
        status: 'INACTIVE',
      },
    });
  }
}
