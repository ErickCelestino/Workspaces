import { Inject } from '@nestjs/common';
import {
  VerifyUserPermissionsByIdRepository,
  PermissionsUserResponseDto,
} from '@workspaces/domain';
import { PrismaService } from '../../../../application';

export class VerifyUserPermissionsByIdRepositoryImpl
  implements VerifyUserPermissionsByIdRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async verify(id: string): Promise<PermissionsUserResponseDto> {
    const result = await this.prismaService.generalPrisma.user.findFirst({
      where: {
        user_id: id,
      },
      select: {
        type: true,
        status: true,
      },
    });

    return {
      type: result?.type ?? '',
      status: result?.status ?? '',
    };
  }
}
