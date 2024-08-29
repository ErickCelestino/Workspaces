import { Inject } from '@nestjs/common';
import {
  CreateCompanyResponsibleDto,
  CreateCompanyResponsibleRespository,
} from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class CreateCompanyResposibleRepositoryImpl
  implements CreateCompanyResponsibleRespository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async create(input: CreateCompanyResponsibleDto): Promise<string> {
    const createdCompanyResponsible =
      await this.prismaService.company_Responsible.create({
        data: {
          cpf: input.body.document,
          email: input.body.email,
          name: input.body.name,
          phone: input.body.phone,
          birth_date: new Date(input.body.birthdate),
          company_id: input.companyId,
        },
      });

    return createdCompanyResponsible?.company_responsible_id ?? '';
  }
}
