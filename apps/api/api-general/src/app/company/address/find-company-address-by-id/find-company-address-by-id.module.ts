import { Module } from '@nestjs/common';
import { FindCompanyAddressByIdService } from './find-company-address-by-id.service';
import { FindCompanyAddressByIdController } from './find-company-address-by-id.controller';
import { FindCompanyAddressById } from '@workspaces/domain';
import {
  FindCompanyAddressByIdRepositoryImpl,
  FindUserByIdRepositoryImpl,
  PrismaGeneralService,
} from '@workspaces/data-access';

@Module({
  controllers: [FindCompanyAddressByIdController],
  providers: [
    FindCompanyAddressByIdService,
    FindCompanyAddressById,
    {
      provide: 'PrismaService',
      useClass: PrismaGeneralService,
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
