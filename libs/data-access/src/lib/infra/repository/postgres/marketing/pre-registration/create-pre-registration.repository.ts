import { Inject } from '@nestjs/common';
import {
  CreatePreRegistrationDto,
  CreatePreRegistrationRepository,
} from '@workspaces/domain';
import { PrismaService } from '../../../../../application';

export class CreatePreRegistrationRepostioryImpl
  implements CreatePreRegistrationRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async create(input: CreatePreRegistrationDto): Promise<string> {
    const { sendingId } = input;
    console.log(input);
    const createdPreRegistration =
      await this.prismaService.marketingPrisma.pre_registration.create({
        data: {
          sending_id: sendingId,
        },
      });

    return createdPreRegistration?.pre_registration_id ?? '';
  }
}