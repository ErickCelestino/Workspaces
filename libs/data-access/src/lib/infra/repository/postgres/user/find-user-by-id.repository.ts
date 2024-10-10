import { Inject } from '@nestjs/common';
import { FindUserByIdRepository, UserList } from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class FindUserByIdRepositoryImpl implements FindUserByIdRepository {
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}

  async find(id: string): Promise<UserList> {
    const userResult = await this.prismaService.user.findFirst({
      where: {
        user_id: id,
      },
      select: {
        user_id: true,
        name: true,
        nick_name: true,
        birth_date: true,
        status: true,
        type: true,
        profile_url: true,
        auth: {
          select: {
            auth_id: true,
            email: true,
            password: true,
          },
        },
      },
    });

    const mappedUser: UserList = {
      name: userResult?.name ?? '',
      nickname: userResult?.nick_name ?? '',
      birthDate: userResult?.birth_date ?? new Date(),
      userId: userResult?.user_id ?? '',
      email: userResult?.auth[0]?.email ?? '',
      status: userResult?.status ?? '',
      type: userResult?.type ?? '',
      userImage: userResult?.profile_url ?? '',
    };

    return mappedUser;
  }
}
