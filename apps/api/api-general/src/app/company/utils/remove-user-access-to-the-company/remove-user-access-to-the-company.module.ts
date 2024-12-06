import { Module } from '@nestjs/common';
import { RemoveUserAccessToTheCompanyService } from './remove-user-access-to-the-company.service';
import { RemoveUserAccessToTheCompanyController } from './remove-user-access-to-the-company.controller';
import { RemoveUserAccessToTheCompany } from '@workspaces/domain';
import {
  FindCompanyByIdRepositoryImpl,
  FindUserByIdRepositoryImpl,
  FindUserIdByCompanyIdRepositoryImpl,
  ListCompaniesByUserIdRepositoryImpl,
  PrismaGeneralService,
  RemoveUserAccessToTheCompanyRepositoryImpl,
  VerifyUserPermissionsByIdRepositoryImpl,
} from '@workspaces/data-access';

@Module({
  controllers: [RemoveUserAccessToTheCompanyController],
  providers: [
    RemoveUserAccessToTheCompanyService,
    RemoveUserAccessToTheCompany,
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
      provide: 'FindUserIdByCompanyIdRepository',
      useClass: FindUserIdByCompanyIdRepositoryImpl,
    },
    {
      provide: 'VerifyUserPermissionsByIdRepository',
      useClass: VerifyUserPermissionsByIdRepositoryImpl,
    },
    {
      provide: 'ListCompaniesByUserIdRepository',
      useClass: ListCompaniesByUserIdRepositoryImpl,
    },
    {
      provide: 'RemoveUserAccessToTheCompanyRepository',
      useClass: RemoveUserAccessToTheCompanyRepositoryImpl,
    },
  ],
})
export class RemoveUserAccessToTheCompanyModule {}
