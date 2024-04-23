import { Inject } from '@nestjs/common';
import {
  ConsultCNPJResponse,
  CreateCompanyDto,
  CreateCompanyRepository,
} from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class CreateCompanyRepositoryImpl implements CreateCompanyRepository {
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}

  async create(
    inputDto: CreateCompanyDto,
    inputData: ConsultCNPJResponse
  ): Promise<string> {
    const { fantasy_name, cnpj } = inputDto;
    const { name, legal_nature, email, opening, port, situation, telephone } =
      inputData;
    await this.prismaService.company.create({
      data: {
        fantasy_name: fantasy_name,
        cnpj: cnpj,
        social_reason: name,
      },
    });

    const filteredCompany = await this.prismaService.company.findFirst({
      where: {
        cnpj: cnpj,
      },
      select: {
        company_id: true,
      },
    });

    const filteredCompanyId =
      filteredCompany === null ? '' : filteredCompany.company_id;

    await this.prismaService.company_Data.create({
      data: {
        legal_nature: legal_nature,
        opening: opening,
        phone: telephone,
        port: port,
        responsible_email: email,
        situation: situation,
        company_id: filteredCompanyId,
      },
    });

    return filteredCompanyId;
  }
}
