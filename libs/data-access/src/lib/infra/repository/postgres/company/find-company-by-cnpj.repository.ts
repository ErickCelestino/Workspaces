import { Inject } from '@nestjs/common';
import { Company, FindCompanyByCnpjRepository } from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class FindCompanyByCnpjRepositoryImpl
  implements FindCompanyByCnpjRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async find(cnpj: string): Promise<Company> {
    const filteredCompany = await this.prismaService.company.findFirst({
      where: {
        cnpj: cnpj,
      },
      select: {
        company_id: true,
        cnpj: true,
        fantasy_name: true,
        social_reason: true,
      },
    });

    return {
      cnpj: filteredCompany?.cnpj ?? '',
      fantasyName: filteredCompany?.fantasy_name ?? '',
      id: filteredCompany?.company_id ?? '',
      socialReason: filteredCompany?.social_reason ?? '',
    };
  }
}
