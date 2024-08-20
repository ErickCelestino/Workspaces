import { Module } from '@nestjs/common';
import { CreateCompanyService } from './create-company.service';
import { CreateCompanyController } from './create-company.controller';
import { CreateCompany } from '@workspaces/domain';
import {
  CreateCompanyRepositoryImpl,
  FindCompanyByCnpjRepositoryImpl,
  FindUserByIdRepositoryImpl,
  PrismaService,
} from '@workspaces/data-access';

@Module({
  controllers: [CreateCompanyController],
  providers: [
    CreateCompanyService,
    CreateCompany,
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'FindUserByIdRepository',
      useClass: FindUserByIdRepositoryImpl,
    },
    {
      provide: 'FindCompanyByCnpjRepository',
      useClass: FindCompanyByCnpjRepositoryImpl,
    },
    {
      provide: 'CreateCompanyRepository',
      useClass: CreateCompanyRepositoryImpl,
    },
  ],
})
export class CreateCompanyModule {}
