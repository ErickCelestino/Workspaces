import { Inject } from '@nestjs/common';
import {
  CompanySimpleResponseDto,
  FindSimpleCompanyByIdDto,
  FindSimpleCompanyByIdRepository,
} from '@workspaces/domain';
import { PrismaService } from '../../../../../application';

export class FindSimpleCompanyByIdRepositoryImpl
  implements FindSimpleCompanyByIdRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async find(
    input: FindSimpleCompanyByIdDto
  ): Promise<CompanySimpleResponseDto> {
    const { companyId } = input;

    const filteredCompany =
      await this.prismaService.generalPrisma.company.findFirst({
        where: {
          company_id: companyId,
        },
        select: {
          company_id: true,
          cnpj: true,
          fantasy_name: true,
          social_reason: true,
          created_at: true,
        },
      });

    return {
      id: filteredCompany?.company_id ?? '',
      cnpj: filteredCompany?.cnpj ?? '',
      fantasyName: filteredCompany?.fantasy_name ?? '',
      socialReason: filteredCompany?.social_reason ?? '',
    };
  }
}
