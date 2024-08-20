import { Inject } from '@nestjs/common';
import { EditUserDto, EditUserRepository } from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class EditUserRepositoryImpl implements EditUserRepository {
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async edit(input: EditUserDto): Promise<string> {
    const {
      body: { id, name, birthDate, status },
    } = input;

    const editedUser = await this.prismaService.user.update({
      where: {
        user_id: id,
      },
      data: {
        name,
        ...(Object.keys({ birthDate }).length > 1
          ? { birth_date: birthDate }
          : {}),
        status: status,
        updated_at: new Date(),
      },
    });

    return editedUser.user_id;
  }
}
