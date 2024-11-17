import { Inject } from '@nestjs/common';
import {
  CreatePreRegistrationDto,
  CreatePreRegistrationRepository,
} from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class CreatePreRegistrationRepostioryImpl
  implements CreatePreRegistrationRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async create(input: CreatePreRegistrationDto): Promise<string> {
    const { sendingId } = input;

    const createdPreRegistration =
      await this.prismaService.pre_registration.create({
        data: {
          sending_id: sendingId,
        },
      });

    return createdPreRegistration?.pre_registration_id ?? '';
  }
}
