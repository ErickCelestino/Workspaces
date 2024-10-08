import { Inject } from '@nestjs/common';
import {
  CompanyAllIdsResponseDto,
  FindAllCompanyIdsDto,
  FindAllCompanyIdsRepository,
} from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class FindAllCompanyIdsRepositoryImpl
  implements FindAllCompanyIdsRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async find(input: FindAllCompanyIdsDto): Promise<CompanyAllIdsResponseDto> {
    const { companyId } = input;

    const allCompanyIds = await this.prismaService.company.findFirst({
      where: {
        company_id: companyId,
      },
      select: {
        company_id: true,
        company_data: {
          select: {
            company_data_id: true,
          },
        },
        company_x_address: {
          select: {
            address_id: true,
          },
        },
        company_responsible: {
          select: {
            company_responsible_id: true,
          },
        },
      },
    });

    return {
      companyAddressId: allCompanyIds?.company_x_address[0].address_id ?? '',
      companyDataId: allCompanyIds?.company_data[0].company_data_id ?? '',
      companySimpleId: allCompanyIds?.company_id ?? '',
      companyResponsibleId:
        allCompanyIds?.company_responsible[0].company_responsible_id ?? '',
    };
  }
}
