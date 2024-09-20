import { Inject } from '@nestjs/common';
import {
  FindUnauthorizedUsersByCompanyIdDto,
  FindUnauthorizedUsersByCompanyIdRepository,
  UserList,
} from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class FindUnauthorizedUsersByCompanyIdRepositoryImpl
  implements FindUnauthorizedUsersByCompanyIdRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async find(input: FindUnauthorizedUsersByCompanyIdDto): Promise<UserList[]> {
    const { loggedUserId, companyId } = input;

    const filteredUsers = await this.prismaService.user_X_Company.findMany({
      where: {
        company_id: companyId,
        user: {
          status: 'BLOCKED',
        },
      },
      select: {
        user_id: true,
        user: {
          select: {
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
        },
      },
    });

    const mappedUsers = filteredUsers.map((user) => {
      return {
        name: user.user.name ?? '',
        nickname: user.user.nick_name ?? '',
        birthDate: user.user.birth_date ?? new Date(),
        userId: user.user_id ?? '',
        email: user.user.auth[0]?.email ?? '',
        status: user.user?.status ?? '',
        type: user.user.type ?? '',
      };
    });

    return mappedUsers;
  }
}
