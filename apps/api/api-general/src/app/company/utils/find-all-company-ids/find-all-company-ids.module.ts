import { Module } from '@nestjs/common';
import { FindAllCompanyIdsService } from './find-all-company-ids.service';
import { FindAllCompanyIdsController } from './find-all-company-ids.controller';
import {
  FindAllCompanyIdsRepositoryImpl,
  FindCompanyByIdRepositoryImpl,
  FindUserByIdRepositoryImpl,
  PrismaGeneralService,
} from '@workspaces/data-access';
import { FindAllCompanyIds } from '@workspaces/domain';

@Module({
  controllers: [FindAllCompanyIdsController],
  providers: [
    FindAllCompanyIdsService,
    FindAllCompanyIds,
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
      provide: 'FindAllCompanyIdsRepository',
      useClass: FindAllCompanyIdsRepositoryImpl,
    },
  ],
})
export class FindAllCompanyIdsModule {}
