import { Module } from '@nestjs/common';
import { CreateCompanyDataService } from './create-company-data.service';
import { CreateCompanyDataController } from './create-company-data.controller';
import { CreateCompanyData } from '@workspaces/domain';
import {
  CreateCompanyDataRepositoryImpl,
  FindCompanyByIdRepositoryImpl,
  FindUserByIdRepositoryImpl,
  PrismaGeneralService,
} from '@workspaces/data-access';

@Module({
  controllers: [CreateCompanyDataController],
  providers: [
    CreateCompanyDataService,
    CreateCompanyData,
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
      provide: 'CreateCompanyDataRepository',
      useClass: CreateCompanyDataRepositoryImpl,
    },
  ],
})
export class CreateCompanyDataModule {}
