import { Inject } from '@nestjs/common';
import {
  AuthorizeUserToCompanyDto,
  AuthorizeUserToCompanyRepository,
} from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class AuthorizeUserToCompanyRepositoryImpl
  implements AuthorizeUserToCompanyRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async auth(input: AuthorizeUserToCompanyDto): Promise<string> {
    const { userId } = input;
    const authorizedUser = await this.prismaService.user.update({
      where: {
        user_id: userId,
      },
      data: {
        status: 'ACTIVE',
        updated_at: new Date(),
      },
    });

    return authorizedUser.user_id ?? '';
  }
}
