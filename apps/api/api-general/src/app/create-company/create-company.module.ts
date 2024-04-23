import { Module } from '@nestjs/common';
import { CreateCompanyService } from './create-company.service';
import { CreateCompanyController } from './create-company.controller';
import { CreateCompany } from '@workspaces/domain';
import {
  ConsultCNPJRepositoryImpl,
  CreateCompanyAddressRepositoryImpl,
  CreateCompanyRepositoryImpl,
  FilterCityByNameRepositoryImpl,
  FilterCompanyByCnpjRepositoryImpl,
  PrismaService,
  ValidateCNPJRepositoryImpl,
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
      provide: 'ValidateCNPJRepository',
      useClass: ValidateCNPJRepositoryImpl,
    },
    {
      provide: 'ConsultCNPJRepository',
      useClass: ConsultCNPJRepositoryImpl,
    },
    {
      provide: 'CreateCompanyAddressRepository',
      useClass: CreateCompanyAddressRepositoryImpl,
    },
    {
      provide: 'FilterCityByNameRepository',
      useClass: FilterCityByNameRepositoryImpl,
    },
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
  ],
})
export class CreateCompanyModule {}
