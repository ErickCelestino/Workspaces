import { Module } from '@nestjs/common';
import { SelectCompanyService } from './select-company.service';
import { SelectCompanyController } from './select-company.controller';
import { SelectCompany } from '@workspaces/domain';
import {
  FindCompanyByIdRepositoryImpl,
  FindUserByIdRepositoryImpl,
  PrismaService,
  SelectCompanyRepositoryImpl,
} from '@workspaces/data-access';

@Module({
  controllers: [SelectCompanyController],
  providers: [
    SelectCompanyService,
    SelectCompany,
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
      provide: 'SelectCompanyRepository',
      useClass: SelectCompanyRepositoryImpl,
    },
  ],
})
export class SelectCompanyModule {}
