import { Module } from '@nestjs/common';
import { ListCompanyService } from './list-company.service';
import { ListCompanyController } from './list-company.controller';
import { ListCompany } from '@workspaces/domain';
import {
  FindUserByIdRepositoryImpl,
  ListCompanyRepositoryImpl,
  PrismaService,
  VerifyUserPermissionsByIdRepositoryImpl,
} from '@workspaces/data-access';

@Module({
  controllers: [ListCompanyController],
  providers: [
    ListCompanyService,
    ListCompany,
    {
      provide: 'PrismaService',
      useClass: PrismaService,
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
      provide: 'ListCompanyRepository',
      useClass: ListCompanyRepositoryImpl,
    },
  ],
})
export class ListCompanyModule {}
