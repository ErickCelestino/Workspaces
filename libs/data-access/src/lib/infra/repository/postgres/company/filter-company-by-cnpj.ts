import { Inject } from '@nestjs/common';
import { FilterCompanyByCnpjRepository, Company } from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class FilterCompanyByCnpjRepositoryImpl
  implements FilterCompanyByCnpjRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}

  async filter(input: string): Promise<Company | undefined> {
    const userResult = await this.prismaService.company.findFirst({
      where: {
        cnpj: input,
      },
      select: {
        name: true,
        cnpj: true,
        company_id: true,
      },
    });
    const result: Company = {
      id: userResult?.company_id == undefined ? '' : userResult.company_id,
      cnpj: userResult?.cnpj == undefined ? '' : userResult.cnpj,
      name: userResult?.name == undefined ? '' : userResult.name,
    };

    return result.id == '' ? undefined : result;
  }
}
