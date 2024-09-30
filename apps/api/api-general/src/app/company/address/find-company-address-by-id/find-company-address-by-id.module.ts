import { Module } from '@nestjs/common';
import { FindCompanyAddressByIdService } from './find-company-address-by-id.service';
import { FindCompanyAddressByIdController } from './find-company-address-by-id.controller';
import { FindCompanyAddressById } from '@workspaces/domain';
import {
  FindCompanyAddressByIdRepositoryImpl,
  FindUserByIdRepositoryImpl,
  PrismaService,
} from '@workspaces/data-access';

@Module({
  controllers: [FindCompanyAddressByIdController],
  providers: [
    FindCompanyAddressByIdService,
    FindCompanyAddressById,
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'FindUserByIdRepository',
      useClass: FindUserByIdRepositoryImpl,
    },
    {
      provide: 'FindCompanyAddressByIdRepository',
      useClass: FindCompanyAddressByIdRepositoryImpl,
    },
  ],
})
export class FindCompanyAddressByIdModule {}
