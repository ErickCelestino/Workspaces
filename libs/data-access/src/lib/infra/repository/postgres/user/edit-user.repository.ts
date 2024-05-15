import { Inject } from '@nestjs/common';
import { EditUserDto, EditUserRepository } from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class EditUserRepositoryImpl implements EditUserRepository {
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async edit(input: EditUserDto): Promise<void> {
    const { id, name, birthDate } = input;

    await this.prismaService.user.update({
      where: {
        user_id: id,
      },
      data: {
        name,
        ...(birthDate!.toString().length > 1 ? { birth_date: birthDate } : {}),
      },
    });
  }
}
