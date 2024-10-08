import { Inject } from '@nestjs/common';
import {
  ListUserDto,
  ListUserRepository,
  ListUserResponseDto,
} from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class ListUserRepositoryImpl implements ListUserRepository {
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}

  async list(input: ListUserDto): Promise<ListUserResponseDto> {
    const skip = input?.skip || 0;
    const take = input?.take || 6;

    const [users, total] = await this.prismaService.$transaction([
      this.prismaService.user.findMany({
        where: {
          ...(input !== null
            ? {
                OR: [
                  { name: { contains: input.filter, mode: 'insensitive' } },
                  {
                    auth: {
                      some: {
                        email: { contains: input.filter, mode: 'insensitive' },
                      },
                    },
                  },
                ],
              }
            : {}),
        },
        orderBy: {
          name: 'asc',
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
        skip: parseInt(skip.toString()),
        take: parseInt(take.toString()),
      }),
      this.prismaService.user.count(),
    ]);

    const totalPages = Math.ceil(total / take);

    const mappedUsers = users.map((user) => {
      return {
        name: user.name ?? '',
        nickname: user.nick_name ?? '',
        birthDate: user.birth_date ?? new Date(),
        userId: user.user_id ?? '',
        email: user.auth[0]?.email ?? '',
        status: user?.status ?? '',
        type: user?.type ?? '',
      };
    });
    return {
      total,
      totalPages,
      users: mappedUsers,
    };
  }
}
