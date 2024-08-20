import { Inject } from '@nestjs/common';
import {
  Company,
  CreateCompanyDto,
  CreateCompanyRepository,
  FindCompanyByCnpjRepository,
} from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class CreateCompanyRepositoryImpl implements CreateCompanyRepository {
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async create(input: CreateCompanyDto): Promise<string> {
    const { cnpj, fantasyName, socialReason } = input;

    const createdCompany = await this.prismaService.company.create({
      data: {
        cnpj: cnpj,
        fantasy_name: fantasyName,
        social_reason: socialReason,
      },
    });

    return createdCompany?.company_id ?? '';
  }
}
