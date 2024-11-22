import {
  UpdatePreRegistrationDto,
  UpdatePreRegistrationRepository,
} from '@workspaces/domain';
import { PrismaService } from '../../../../../application';
import { Inject } from '@nestjs/common';

export class UpdatePreRegistrationRepositoryImpl
  implements UpdatePreRegistrationRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async update(input: UpdatePreRegistrationDto): Promise<string> {
    const { id, branchOfTheCompany } = input;

    const updatedPreRegistration =
      await this.prismaService.marketingPrisma.pre_registration.update({
        where: {
          pre_registration_id: id,
        },
        data: {
          finished_at: new Date(),
          step: 'FINAL',
          completed_questionnaire: true,
          branch_of_the_company: branchOfTheCompany,
        },
      });

    return updatedPreRegistration.pre_registration_id ?? '';
  }
}
