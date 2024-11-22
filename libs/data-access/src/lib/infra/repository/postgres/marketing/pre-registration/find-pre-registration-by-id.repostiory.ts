import { Inject } from '@nestjs/common';
import {
  FindPreRegistrationByIdRepository,
  PreRegistartionResponseDto,
} from '@workspaces/domain';
import { PrismaService } from '../../../../../application';

export class FindPreRegistrationByIdRepositoryImpl
  implements FindPreRegistrationByIdRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async find(id: string): Promise<PreRegistartionResponseDto> {
    const filteredPreRegistration =
      await this.prismaService.marketingPrisma.pre_registration.findFirst({
        where: {
          pre_registration_id: id,
        },
        select: {
          pre_registration_date: true,
          pre_registration_id: true,
          step: true,
        },
      });

    return {
      id: filteredPreRegistration?.pre_registration_id ?? '',
      createdAt: filteredPreRegistration?.pre_registration_date ?? new Date(),
      step: filteredPreRegistration?.step ?? 'INITIAL',
    };
  }
}
