import { Inject } from '@nestjs/common';
import {
  DeleteUserByIdDto,
  DeleteUserByIdRepository,
} from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class DeleteUserByIdRepositoryImpl implements DeleteUserByIdRepository {
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async delete(input: DeleteUserByIdDto): Promise<string> {
    await this.prismaService.confirm_Delete_User.create({
      data: {
        user_id: input.id,
        description: input.description,
        responsibly_user: input.loggedUser,
      },
    });

    const updatedUser = await this.prismaService.user.update({
      where: {
        user_id: input.id,
      },
      data: {
        status: 'INACTIVE',
      },
    });

    return updatedUser.user_id;
  }
}
