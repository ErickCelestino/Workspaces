import { Inject } from '@nestjs/common';
import { SelectCompanyDto, SelectCompanyRepository } from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class SelectCompanyRepositoryImpl implements SelectCompanyRepository {
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async select(input: SelectCompanyDto): Promise<string> {
    const { companyId, loggedUserId } = input;

    const selectedCompany = await this.prismaService.user_X_Company.create({
      data: {
        company_id: companyId,
        user_id: loggedUserId,
      },
    });

    if (selectedCompany.company_id) {
      await this.prismaService.user.update({
        where: {
          user_id: loggedUserId,
        },
        data: {
          status: 'BLOCKED',
          updated_at: new Date(),
        },
      });
    }

    return selectedCompany.company_id;
  }
}
