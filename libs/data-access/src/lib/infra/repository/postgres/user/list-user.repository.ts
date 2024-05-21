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
    const skip = input?.skip || 6;
    const take = input?.take || 0;

    const [users, total] = await this.prismaService.$transaction([
      this.prismaService.user.findMany({
        where: {
          ...(input !== null
            ? {
                OR: [
                  { name: { contains: input.input, mode: 'insensitive' } },
                  {
                    auth: {
                      some: {
                        email: { contains: input.input, mode: 'insensitive' },
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
      };
    });
    return {
      total,
      totalPages,
      users: mappedUsers,
    };
  }
}
