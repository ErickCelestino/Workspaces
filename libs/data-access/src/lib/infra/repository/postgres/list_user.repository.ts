import { Inject } from '@nestjs/common';
import { ListUserRepository, UserList } from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class ListUserRepositoryImpl implements ListUserRepository {
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}

  async list(input: string): Promise<UserList[]> {
    // console.log(input);

    const userResult = await this.prismaService.user.findMany({
      where: {
        OR: [
          { name: { contains: input, mode: 'insensitive' } },
          {
            auth: {
              some: { email: { contains: input, mode: 'insensitive' } },
            },
          },
        ],
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

    const mappedUsers: UserList[] = userResult.map((user) => {
      return {
        name: user.name == null ? '' : user.name,
        nickname: user.nick_name == null ? '' : user.nick_name,
        birthDate: user.birth_date == null ? new Date() : user.birth_date,
        userId: user.user_id == null ? '' : user.user_id,
        email: user.auth[0].email == null ? '' : user.auth[0].email,
      };
    });
    console.log(`teste: ${mappedUsers[0].email}`);
    return mappedUsers;
  }
}
