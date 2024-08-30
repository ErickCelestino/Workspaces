import { Module } from '@nestjs/common';
import { CreateCompanyDataService } from './create-company-data.service';
import { CreateCompanyDataController } from './create-company-data.controller';
import { CreateCompanyData } from '@workspaces/domain';
import {
  CreateCompanyDataRepositoryImpl,
  FindCompanyByIdRepositoryImpl,
  FindUserByIdRepositoryImpl,
  PrismaService,
} from '@workspaces/data-access';

@Module({
  controllers: [CreateCompanyDataController],
  providers: [
    CreateCompanyDataService,
    CreateCompanyData,
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
      provide: 'CreateCompanyDataRepository',
      useClass: CreateCompanyDataRepositoryImpl,
    },
  ],
})
export class CreateCompanyDataModule {}
