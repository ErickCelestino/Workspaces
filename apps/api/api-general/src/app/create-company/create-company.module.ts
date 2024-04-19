import { Module } from '@nestjs/common';
import { CreateCompanyService } from './create-company.service';
import { CreateCompanyController } from './create-company.controller';
import { CreateCompany } from '@workspaces/domain';
import {
  CreateCompanyRepositoryImpl,
  FilterCompanyByCnpjRepositoryImpl,
  PrismaService,
} from '@workspaces/data-access';

@Module({
  controllers: [CreateCompanyController],
  providers: [
    CreateCompany,
    CreateCompanyService,
    {
      provide: 'CreateCompanyRepository',
      useClass: CreateCompanyRepositoryImpl,
    },
    {
      provide: 'FilterCompanyByCnpjRepository',
      useClass: FilterCompanyByCnpjRepositoryImpl,
    },
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
  ],
})
export class CreateCompanyModule {}
