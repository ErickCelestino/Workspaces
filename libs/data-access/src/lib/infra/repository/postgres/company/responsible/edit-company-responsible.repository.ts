import { Inject } from '@nestjs/common';
import {
  EditCompanyResponsibleDto,
  EditCompanyResponsibleRepository,
} from '@workspaces/domain';
import { PrismaService } from '../../../../../application';

export class EditCompanyResponsibleRepositoryImpl
  implements EditCompanyResponsibleRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async edit(input: EditCompanyResponsibleDto): Promise<string> {
    const editedCompanyResponsible =
      await this.prismaService.generalPrisma.company_Responsible.update({
        where: {
          company_responsible_id: input.companyResponsibleId,
        },
        data: {
          email: input.body.email,
          name: input.body.name,
          phone: input.body.phone,
          birth_date: new Date(input.body.birthdate),
        },
      });

    return editedCompanyResponsible?.company_responsible_id ?? '';
  }
}
