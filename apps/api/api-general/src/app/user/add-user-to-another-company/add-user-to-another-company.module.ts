import { Module } from '@nestjs/common';
import { AddUserToAnotherCompanyService } from './add-user-to-another-company.service';
import { AddUserToAnotherCompanyController } from './add-user-to-another-company.controller';
import { AddUserToAnotherCompany } from '@workspaces/domain';
import {
  AddUserToAnotherCompanyRepositoryImpl,
  FindCompanyByIdRepositoryImpl,
  FindUserByIdRepositoryImpl,
  FindUserIdByCompanyIdRepositoryImpl,
  PrismaService,
  VerifyUserPermissionsByIdRepositoryImpl,
} from '@workspaces/data-access';

@Module({
  controllers: [AddUserToAnotherCompanyController],
  providers: [
    AddUserToAnotherCompanyService,
    AddUserToAnotherCompany,
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
      provide: 'FindUserIdByCompanyIdRepository',
      useClass: FindUserIdByCompanyIdRepositoryImpl,
    },
    {
      provide: 'VerifyUserPermissionsByIdRepository',
      useClass: VerifyUserPermissionsByIdRepositoryImpl,
    },
    {
      provide: 'AddUserToAnotherCompanyRepository',
      useClass: AddUserToAnotherCompanyRepositoryImpl,
    },
  ],
})
export class AddUserToAnotherCompanyModule {}
