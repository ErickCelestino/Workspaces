import { Inject } from '@nestjs/common';
import {
  FindUserAndCompanyIdDto,
  FindUserIdByCompanyIdRepository,
} from '@workspaces/domain';
import { PrismaService } from '../../../../../application';

export class FindUserIdByCompanyIdRepositoryImpl
  implements FindUserIdByCompanyIdRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async find(input: FindUserAndCompanyIdDto): Promise<string> {
    const { companyId, userId } = input;

    const userInCompany =
      await this.prismaService.generalPrisma.user_X_Company.findFirst({
        where: {
          company_id: companyId,
          user_id: userId,
        },
        select: {
          company_id: true,
          user_id: true,
        },
      });

    return userInCompany?.company_id
      ? `${userInCompany?.user_id ?? ''}-${userInCompany?.company_id ?? ''}`
      : '';
  }
}
