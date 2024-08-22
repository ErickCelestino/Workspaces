import { Inject } from '@nestjs/common';
import {
  CreateCompanyDataDto,
  CreateCompanyDataRepository,
} from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class CreateCompanyDataRepositoryImpl
  implements CreateCompanyDataRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async create(input: CreateCompanyDataDto): Promise<string> {
    const {
      body: { legalNature, opening, phone, port, situation, responsibleEmail },
      companyId,
    } = input;

    const createdCompany = await this.prismaService.company_Data.create({
      data: {
        legal_nature: legalNature,
        opening: opening,
        phone: phone,
        port: port,
        situation: situation,
        company_id: companyId,
        responsible_email: responsibleEmail,
      },
    });

    return createdCompany?.company_id ?? '';
  }
}
