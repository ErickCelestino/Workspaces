import { Inject } from '@nestjs/common';
import { ListUser, ListUserRepository, UserList } from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class ListUserRepositoryImpl implements ListUserRepository {
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}

  async list(input: string): Promise<UserList[]> {
    const userResult = await this.prismaService.user.findMany({
      where: {
        ...(input !== null
          ? {
              OR: [
                { name: { contains: input, mode: 'insensitive' } },
                {
                  auth: {
                    some: { email: { contains: input, mode: 'insensitive' } },
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
        auth: {
          select: {
            auth_id: false,
            email: true,
            user_id: false,
            status: true,
          },
        },
      },
    });

    const mappedUsers = userResult.map((user) => {
      return {
        name: user.name ?? '',
        nickname: user.nick_name ?? '',
        birthDate: user.birth_date ?? new Date(),
        userId: user.user_id ?? '',
        email: user.auth[0]?.email ?? '',
      };
    });
    return mappedUsers;
  }
}
