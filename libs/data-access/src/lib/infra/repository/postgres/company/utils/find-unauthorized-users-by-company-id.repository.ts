import { Inject } from '@nestjs/common';
import {
  FindUnauthorizedUsersByCompanyIdDto,
  FindUnauthorizedUsersByCompanyIdRepository,
  UnauthorizedUsersByCompanyIdResponseDto,
} from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';
import { Status } from '@prisma/client';

export class FindUnauthorizedUsersByCompanyIdRepositoryImpl
  implements FindUnauthorizedUsersByCompanyIdRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async find(
    input: FindUnauthorizedUsersByCompanyIdDto
  ): Promise<UnauthorizedUsersByCompanyIdResponseDto> {
    const { companyId } = input;

    const whereClause = {
      company_id: companyId,
      user: {
        status: Status.BLOCKED,
      },
    };

    const [users, total] = await this.prismaService.$transaction([
      this.prismaService.user_X_Company.findMany({
        where: whereClause,
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
      }),
      this.prismaService.user_X_Company.count({
        where: whereClause,
      }),
    ]);

    const mappedUsers = users.map((user) => {
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

    return {
      listUsers: mappedUsers,
      total: total,
    };
  }
}
