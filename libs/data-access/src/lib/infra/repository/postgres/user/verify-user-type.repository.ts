import { Inject } from '@nestjs/common';
import { VerifyUserTypeByIdRepository } from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class VerifyUserTypeByIdRepositoryImpl
  implements VerifyUserTypeByIdRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async verify(id: string): Promise<string> {
    const result = await this.prismaService.user.findFirst({
      where: {
        user_id: id,
      },
      select: {
        type: true,
      },
    });

    return result?.type ?? '';
  }
}
