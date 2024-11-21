import { Module } from '@nestjs/common';
import { CreatePreRegistrationService } from './create-pre-registration.service';
import { CreatePreRegistrationController } from './create-pre-registration.controller';
import { CreatePreRegistration } from '@workspaces/domain';
import {
  CreatePreRegistrationRepostioryImpl,
  FindSendingByIdRepositoryImpl,
  PrismaService,
} from '@workspaces/data-access';

@Module({
  controllers: [CreatePreRegistrationController],
  providers: [
    CreatePreRegistrationService,
    CreatePreRegistration,
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'FindSendingByIdRepository',
      useClass: FindSendingByIdRepositoryImpl,
    },
    {
      provide: 'CreatePreRegistrationRepository',
      useClass: CreatePreRegistrationRepostioryImpl,
    },
  ],
})
export class CreatePreRegistrationModule {}
