import { Inject } from '@nestjs/common';
import {
  CompanyAddressResponseDto,
  CompanyDataResponseDto,
  FindCompanyByIdRepository,
} from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class FindCompanyByIdRepositoryImpl
  implements FindCompanyByIdRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}

  async find(id: string): Promise<CompanyDataResponseDto> {
    const filteredCompany = await this.prismaService.company.findFirst({
      where: {
        company_id: id,
      },
      select: {
        company_id: true,
        cnpj: true,
        fantasy_name: true,
        social_reason: true,
        created_at: true,
        company_data: {
          where: {
            company_id: id,
          },
          select: {
            legal_nature: true,
            opening: true,
            phone: true,
            port: true,
            situation: true,
            responsible_email: true,
          },
        },
        company_x_address: {
          where: {
            company_id: id,
          },
          select: {
            address: {
              select: {
                city: {
                  select: {
                    name: true,
                    state: {
                      select: {
                        country: {
                          select: {
                            name: true,
                          },
                        },
                        name: true,
                        ur: true,
                      },
                    },
                  },
                },
                address_id: true,
                complement: true,
                district: true,
                number: true,
                street: true,
                zipcode: true,
              },
            },
          },
        },
      },
    });

    const mappedCompanyAddress: CompanyAddressResponseDto[] =
      filteredCompany?.company_x_address?.map((address) => ({
        id: address?.address?.address_id ?? '',
        city: address?.address?.city?.name ?? '',
        state: address?.address?.city?.state?.name ?? '',
        street: address?.address?.street ?? '',
        number: address?.address?.number ?? '',
        district: address?.address?.district ?? '',
        zipcode: address?.address?.zipcode ?? '',
        complement: address?.address?.complement ?? '',
        country: address?.address?.city?.state?.country?.name ?? '',
      })) || [];

    const mappedCompany: CompanyDataResponseDto = {
      id: filteredCompany?.company_id ?? '',
      address: mappedCompanyAddress,
      phone: filteredCompany?.company_data[0]?.phone ?? '',
      situation: filteredCompany?.company_data[0]?.situation ?? '',
      legalNature: filteredCompany?.company_data[0]?.legal_nature ?? '',
      opening: filteredCompany?.company_data[0]?.opening ?? '',
      port: filteredCompany?.company_data[0]?.port ?? '',
      responsibleEmail:
        filteredCompany?.company_data[0]?.responsible_email ?? '',
      simple: {
        cnpj: filteredCompany?.cnpj ?? '',
        fantasyName: filteredCompany?.fantasy_name ?? '',
        socialReason: filteredCompany?.social_reason ?? '',
      },
    };

    return mappedCompany;
  }
}
