import { Module } from '@nestjs/common';
import { AuthorizeUserToCompanyService } from './authorize-user-to-company.service';
import { AuthorizeUserToCompanyController } from './authorize-user-to-company.controller';
import {
  AuthorizeUserToCompanyRepositoryImpl,
  FindCompanyByIdRepositoryImpl,
  FindUserByIdRepositoryImpl,
  FindUserIdByCompanyIdRepositoryImpl,
  PrismaService,
  VerifyUserPermissionsByIdRepositoryImpl,
} from '@workspaces/data-access';
import { AuthorizeUserToCompany } from '@workspaces/domain';

@Module({
  controllers: [AuthorizeUserToCompanyController],
  providers: [
    AuthorizeUserToCompanyService,
    AuthorizeUserToCompany,
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
      provide: 'AuthorizeUserToCompanyRepository',
      useClass: AuthorizeUserToCompanyRepositoryImpl,
    },
  ],
})
export class AuthorizeUserToCompanyModule {}
