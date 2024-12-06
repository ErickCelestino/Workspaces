import { Module } from '@nestjs/common';
import { ListCompaniesByUserIdService } from './list-companies-by-user-id.service';
import { ListCompaniesByUserIdController } from './list-companies-by-user-id.controller';
import { ListCompaniesByUserId } from '@workspaces/domain';
import {
  FindUserByIdRepositoryImpl,
  ListCompaniesByUserIdRepositoryImpl,
  VerifyUserPermissionsByIdRepositoryImpl,
  PrismaGeneralService
} from '@workspaces/data-access';

@Module({
  controllers: [ListCompaniesByUserIdController],
  providers: [
    ListCompaniesByUserIdService,
    ListCompaniesByUserId,
    {
      provide: 'PrismaService',
      useClass: PrismaGeneralService,
    },
    {
      provide: 'FindUserByIdRepository',
      useClass: FindUserByIdRepositoryImpl,
    },
    {
      provide: 'VerifyUserPermissionsByIdRepository',
      useClass: VerifyUserPermissionsByIdRepositoryImpl,
    },
    {
      provide: 'ListCompaniesByUserIdRepository',
      useClass: ListCompaniesByUserIdRepositoryImpl,
    },
  ],
})
export class ListCompaniesByUserIdModule {}
