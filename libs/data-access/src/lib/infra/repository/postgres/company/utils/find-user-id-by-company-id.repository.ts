import { Inject } from '@nestjs/common';
import {
  FindUserAndCompanyIdDto,
  FindUserIdByCompanyIdRepository,
} from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class FindUserIdByCompanyIdRepositoryImpl
  implements FindUserIdByCompanyIdRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async find(input: FindUserAndCompanyIdDto): Promise<string> {
    const { companyId, userId } = input;

    const userInCompany = await this.prismaService.user_X_Company.findFirst({
      where: {
        company_id: companyId,
        user_id: userId,
      },
      select: {
        company_id: true,
        user_id: true,
      },
    });

    return `${userInCompany?.user_id ?? ''}-${userInCompany?.company_id ?? ''}`;
  }
}
