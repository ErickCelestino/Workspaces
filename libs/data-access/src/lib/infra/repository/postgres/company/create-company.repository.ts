import { Inject } from '@nestjs/common';
import { CreateCompanyDto, CreateCompanyRepository } from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class CreateCompanyRepositoryImpl implements CreateCompanyRepository {
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async create(input: CreateCompanyDto): Promise<string> {
    const {
      body: { cnpj, fantasyName, socialReason },
      loggedUserId,
    } = input;

    const createdCompany = await this.prismaService.company.create({
      data: {
        cnpj: cnpj,
        fantasy_name: fantasyName,
        social_reason: socialReason,
        user_id: loggedUserId,
      },
    });

    return createdCompany?.company_id ?? '';
  }
}
