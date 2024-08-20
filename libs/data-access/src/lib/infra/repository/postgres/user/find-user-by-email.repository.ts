import { Inject } from '@nestjs/common';
import {
  FindUserByEmailDto,
  FindUserByEmailRepository,
  LoggedUser,
} from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class FindUserByEmailRepositoryImpl
  implements FindUserByEmailRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async find(input: FindUserByEmailDto): Promise<LoggedUser> {
    const { email } = input;
    const filteredUser = await this.prismaService.user.findFirst({
      where: {
        auth: {
          some: {
            email: email,
          },
        },
      },
      select: {
        user_id: true,
        name: true,
        nick_name: true,
        birth_date: true,
        status: true,
        type: true,
        auth: {
          select: {
            auth_id: false,
            email: true,
            user_id: false,
          },
        },
      },
    });

    return {
      id: filteredUser?.user_id ?? '',
      name: filteredUser?.name ?? '',
      email: filteredUser?.auth[0].email ?? '',
      type: filteredUser?.type ?? '',
      status: filteredUser?.status ?? '',
    };
  }
}
