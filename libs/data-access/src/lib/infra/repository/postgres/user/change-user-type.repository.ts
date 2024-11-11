import { Inject } from '@nestjs/common';
import {
  ChangeUserTypeDto,
  ChangeUserTypeRepository,
} from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class ChangeUserTypeRepositoryImpl implements ChangeUserTypeRepository {
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async change(input: ChangeUserTypeDto): Promise<string> {
    const { type, userId } = input;

    const changedUserType = await this.prismaService.user.update({
      where: {
        user_id: userId,
      },
      data: {
        type: type,
        updated_at: new Date(),
      },
    });

    return changedUserType?.user_id ?? '';
  }
}
