import { Inject } from '@nestjs/common';
import {
  Auth,
  FilterByEmailOrNicknameDto,
  FilterByEmailOrNicknameRepository,
  User,
} from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class FilterByEmailOrNicknameRepositoryImpl
  implements FilterByEmailOrNicknameRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}

  async filter(input: FilterByEmailOrNicknameDto): Promise<User[]> {
    const userList = await this.prismaService.user.findMany({
      where: {
        ...(input.email ? { auth: { some: { email: input.email } } } : {}),
        ...(input.nickName ? { nick_name: input.nickName } : {}),
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

    const mapResult: User[] = userList.map((user) => {
      const mappedAuth: Auth[] = user.auth.map((auth) => {
        return {
          authId: auth.auth_id,
          userId: auth.user_id,
          email: auth.email,
        };
      });

      return {
        userId: user.user_id,
        auth: mappedAuth,
        name: user.name,
        nickname: user.nick_name,
        birthDate: user.birth_date,
      };
    });

    return mapResult;
  }
}
