import { Inject } from '@nestjs/common';
import { FindUserByIdRepository, User, Auth } from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class FindUserByIdRepositoryImpl implements FindUserByIdRepository {
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}

  async find(id: string): Promise<User> {
    const userResult = await this.prismaService.user.findFirst({
      where: {
        user_id: id,
      },
      select: {
        user_id: true,
        name: true,
        nick_name: true,
        birth_date: true,
        auth: {
          select: {
            auth_id: true,
            email: true,
            user_id: true,
          },
        },
      },
    });

    const mappedAuth = userResult?.auth == null ? [] : userResult.auth;
    const findedAuth: Auth[] = mappedAuth.map((auth) => {
      return {
        authId: auth.auth_id,
        userId: auth.user_id,
        email: auth.email,
      };
    });

    const mappedUser: User = {
      name: userResult?.name == null ? '' : userResult.name,
      nickname: userResult?.nick_name == null ? '' : userResult.nick_name,
      birthDate:
        userResult?.birth_date == null ? new Date() : userResult.birth_date,
      userId: userResult?.user_id == null ? '' : userResult.user_id,
      auth: findedAuth,
    };

    return mappedUser;
  }
}
