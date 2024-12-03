import { Module } from '@nestjs/common';
import { UpdatePreRegistration } from '@workspaces/domain';
import {
  FindPreRegistrationByIdRepositoryImpl,
  PrismaService,
  UpdatePreRegistrationRepositoryImpl,
} from '@workspaces/data-access';
import { UpdatePreRegistrationService } from './update-pre-registration.service';
import { UpdatePreRegistrationController } from './update-pre-registration.controller';

@Module({
  controllers: [UpdatePreRegistrationController],
  providers: [
    UpdatePreRegistrationService,
    UpdatePreRegistration,
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'FindPreRegistrationByIdRepository',
      useClass: FindPreRegistrationByIdRepositoryImpl,
    },
    {
      provide: 'UpdatePreRegistrationRepository',
      useClass: UpdatePreRegistrationRepositoryImpl,
    },
  ],
})
export class UpdatePreRegistrationModule {}
