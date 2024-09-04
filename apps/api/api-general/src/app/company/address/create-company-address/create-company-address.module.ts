import { Module } from '@nestjs/common';
import { CreateCompanyAddressService } from './create-company-address.service';
import { CreateCompanyAddressController } from './create-company-address.controller';
import { CreateCompanyAddress } from '@workspaces/domain';
import {
  CreateCompanyAddressRepositoryImpl,
  FindCityByIdRepositoryImpl,
  FindCompanyByIdRepositoryImpl,
  FindCountryByIdRepositoryImpl,
  FindStateByIdRepositoryImpl,
  FindUserByIdRepositoryImpl,
  PrismaService,
} from '@workspaces/data-access';

@Module({
  controllers: [CreateCompanyAddressController],
  providers: [
    CreateCompanyAddressService,
    CreateCompanyAddress,
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
      provide: 'FindCountryByIdRepository',
      useClass: FindCountryByIdRepositoryImpl,
    },
    {
      provide: 'FindStateByIdRepository',
      useClass: FindStateByIdRepositoryImpl,
    },
    {
      provide: 'FindCityByIdRepository',
      useClass: FindCityByIdRepositoryImpl,
    },
    {
      provide: 'CreateCompanyAddressRepository',
      useClass: CreateCompanyAddressRepositoryImpl,
    },
  ],
})
export class CreateCompanyAddressModule {}
