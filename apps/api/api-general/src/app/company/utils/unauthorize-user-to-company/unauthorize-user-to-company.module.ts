import { Module } from '@nestjs/common';
import { UnauthorizeUserToCompanyService } from './unauthorize-user-to-company.service';
import { UnauthorizeUserToCompanyController } from './unauthorize-user-to-company.controller';
import {
  FindCompanyByIdRepositoryImpl,
  FindUserByIdRepositoryImpl,
  FindUserIdByCompanyIdRepositoryImpl,
  PrismaService,
  UnauthorizeUserToCompanyRepositoryImpl,
  VerifyUserPermissionsByIdRepositoryImpl,
} from '@workspaces/data-access';
import { UnauthorizeUserToCompany } from '@workspaces/domain';

@Module({
  controllers: [UnauthorizeUserToCompanyController],
  providers: [
    UnauthorizeUserToCompanyService,
    UnauthorizeUserToCompany,
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
      provide: 'UnauthorizeUserToCompanyRepository',
      useClass: UnauthorizeUserToCompanyRepositoryImpl,
    },
  ],
})
export class UnauthorizeUserToCompanyModule {}