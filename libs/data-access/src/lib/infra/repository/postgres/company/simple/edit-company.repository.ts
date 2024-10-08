import { Inject } from '@nestjs/common';
import { EditCompanyDto, EditCompanyRepository } from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class EditCompanyRepositoryImpl implements EditCompanyRepository {
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async edit(input: EditCompanyDto): Promise<string> {
    const {
      body: { cnpj, fantasyName, socialReason },
      companyId,
    } = input;

    const editedCompany = await this.prismaService.company.update({
      where: {
        company_id: companyId,
      },
      data: {
        cnpj: cnpj,
        fantasy_name: fantasyName,
        social_reason: socialReason,
      },
    });

    return editedCompany?.company_id ?? '';
  }
}
