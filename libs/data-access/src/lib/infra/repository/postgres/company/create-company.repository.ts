import { Inject } from '@nestjs/common';
import { CreateCompanyDto, CreateCompanyRepository } from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class CreateCompanyRepositoryImpl implements CreateCompanyRepository {
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}

  async create(input: CreateCompanyDto): Promise<void> {
    const { name, cnpj } = input;
    await this.prismaService.company.create({
      data: {
        name: name,
        cnpj: cnpj,
      },
    });
  }
}
