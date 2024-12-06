import { Module } from '@nestjs/common';
import { ListUsersByCompanyIdService } from './list-users-by-company-id.service';
import { ListUsersByCompanyIdController } from './list-users-by-company-id.controller';
import { ListUsersByCompanyId } from '@workspaces/domain';
import {
  FindCompanyByIdRepositoryImpl,
  FindUserByIdRepositoryImpl,
  ListUsersByCompanyIdRepositoryImpl,
  PrismaGeneralService,
} from '@workspaces/data-access';

@Module({
  controllers: [ListUsersByCompanyIdController],
  providers: [
    ListUsersByCompanyIdService,
    ListUsersByCompanyId,
    {
      provide: 'PrismaService',
      useClass: PrismaGeneralService,
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
      provide: 'ListUsersByCompanyIdRepository',
      useClass: ListUsersByCompanyIdRepositoryImpl,
    },
  ],
})
export class ListUsersByCompanyIdModule {}
