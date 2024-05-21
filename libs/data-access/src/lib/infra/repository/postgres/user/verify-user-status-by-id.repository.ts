import { Inject } from '@nestjs/common';
import { VerifyUserStatusByIdRepository } from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class VerifyUserStatusByIdRepositoryImpl
  implements VerifyUserStatusByIdRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async verify(input: string): Promise<string> {
    const result = await this.prismaService.user.findFirst({
      where: {
        user_id: input,
      },
      select: {
        status: true,
      },
    });

    return result?.status ?? '';
  }
}
