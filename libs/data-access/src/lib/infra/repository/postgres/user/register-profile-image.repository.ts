import { Inject } from '@nestjs/common';
import {
  RegisterProfileImageDto,
  RegisterProfileImageRepository,
} from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class RegisterProfileImageRepositoryImpl
  implements RegisterProfileImageRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async register(input: RegisterProfileImageDto): Promise<string> {
    const { urlProfile, userId } = input;

    const registeredProfile = await this.prismaService.user.update({
      where: {
        user_id: userId,
      },
      data: {
        profile_url: urlProfile,
        updated_at: new Date(),
      },
    });

    return registeredProfile?.user_id ?? '';
  }
}
