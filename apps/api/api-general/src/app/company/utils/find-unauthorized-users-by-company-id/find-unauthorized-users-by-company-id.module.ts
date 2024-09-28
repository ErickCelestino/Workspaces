import { Module } from '@nestjs/common';
import { FindUnauthorizedUsersByCompanyIdService } from './find-unauthorized-users-by-company-id.service';
import { FindUnauthorizedUsersByCompanyIdController } from './find-unauthorized-users-by-company-id.controller';
import {
  FindCompanyByIdRepositoryImpl,
  FindUnauthorizedUsersByCompanyIdRepositoryImpl,
  FindUserByIdRepositoryImpl,
  PrismaService,
} from '@workspaces/data-access';
import { FindUnauthorizedUsersByCompanyId } from '@workspaces/domain';

@Module({
  controllers: [FindUnauthorizedUsersByCompanyIdController],
  providers: [
    FindUnauthorizedUsersByCompanyIdService,
    FindUnauthorizedUsersByCompanyId,
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'FindUserByIdRepository',
      useClass: FindUserByIdRepositoryImpl,
    },
    {
      provide: 'FindCompanyByIdRepository',
      useClass: FindCompanyByIdRepositoryImpl,
    },
    {
      provide: 'FindUnauthorizedUsersByCompanyIdRepository',
      useClass: FindUnauthorizedUsersByCompanyIdRepositoryImpl,
    },
  ],
})
export class FindUnauthorizedUsersByCompanyIdModule {}
