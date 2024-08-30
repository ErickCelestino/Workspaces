import { Inject } from '@nestjs/common';
import {
  companySimpleResponseDto,
  ListCompanyDto,
  ListCompanyRepository,
  ListCompanyResponseDto,
} from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class ListCompanyRepositoryImpl implements ListCompanyRepository {
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async list(input: ListCompanyDto): Promise<ListCompanyResponseDto> {
    const { filter, loggedUserId } = input;

    const skip = input?.skip || 0;
    const take = input?.take || 6;

    const whereClause = {
      user_id: loggedUserId,
      ...(filter !== ''
        ? {
            name: {
              contains: filter,
              mode: 'insensitive' as const,
            },
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
                user: {
                  select: {
                    nick_name: true,
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

    const mappedCompany: companySimpleResponseDto[] = companies.map(
      (company) => {
        return {
          cnpj: company.company.cnpj,
          fantasyName: company.company.fantasy_name,
          socialReason: company.company.social_reason,
          id: company.company.company_id,
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
