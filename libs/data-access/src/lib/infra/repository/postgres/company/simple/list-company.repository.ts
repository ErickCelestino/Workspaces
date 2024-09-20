import { Inject } from '@nestjs/common';
import {
  ListCompanyDto,
  ListCompanyRepository,
  ListCompanyResponseDto,
  ListSimpleCompanyResponseDto,
} from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class ListCompanyRepositoryImpl implements ListCompanyRepository {
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async list(input: ListCompanyDto): Promise<ListCompanyResponseDto> {
    const { filter, loggedUserId } = input;

    const skip = input?.skip || 0;
    const take = input?.take || 6;

    const whereClause = {
      ...(filter !== ''
        ? {
            OR: [
              {
                company: {
                  social_reason: {
                    contains: filter,
                    mode: 'insensitive' as const,
                  },
                },
              },
              {
                company: {
                  fantasy_name: {
                    contains: filter,
                    mode: 'insensitive' as const,
                  },
                },
              },
            ],
          }
        : {}),
    };

    const [companies, filteredTotal, total] =
      await this.prismaService.$transaction([
        this.prismaService.user_X_Company.findMany({
          where: whereClause,
          select: {
            created_at: true,
            company: {
              select: {
                cnpj: true,
                company_id: true,
                fantasy_name: true,
                social_reason: true,
                status: true,
                user: {
                  select: {
                    nick_name: true,
                  },
                },
                company_x_address: {
                  select: {
                    address: {
                      select: {
                        city: {
                          select: {
                            name: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          skip: parseInt(skip.toString()),
          take: parseInt(take.toString()),
        }),
        this.prismaService.user_X_Company.count({
          where: whereClause,
        }),
        this.prismaService.user_X_Company.count({
          where: {
            user_id: loggedUserId,
          },
        }),
      ]);

    const totalPages = Math.ceil(filteredTotal / take);

    const mappedCompany: ListSimpleCompanyResponseDto[] = companies.map(
      (company) => {
        return {
          id: company?.company.company_id ?? '',
          cnpj: company?.company?.cnpj ?? '',
          fantasyName: company?.company?.fantasy_name ?? '',
          socialReason: company?.company?.social_reason ?? '',
          city:
            company.company?.company_x_address[0]?.address?.city?.name ?? '',
          createdBy: company?.company?.user?.nick_name ?? '',
          createdAt: company?.created_at ?? '',
          status: company?.company?.status ?? 'INACTIVE',
        };
      }
    );

    return {
      filteredTotal,
      total,
      totalPages,
      companies: mappedCompany,
    };
  }
}
