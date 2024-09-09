import { Module } from '@nestjs/common';
import { FindCompanyDataByIdService } from './find-company-data-by-id.service';
import { FindCompanyDataByIdController } from './find-company-data-by-id.controller';
import { FindCompanyDataById } from '@workspaces/domain';
import {
  FindCompanyDataByIdRepositoryImpl,
  FindUserByIdRepositoryImpl,
  PrismaService,
} from '@workspaces/data-access';

@Module({
  controllers: [FindCompanyDataByIdController],
  providers: [
    FindCompanyDataByIdService,
    FindCompanyDataById,
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'FindUserByIdRepository',
      useClass: FindUserByIdRepositoryImpl,
    },
    {
      provide: 'FindCompanyDataByIdRepository',
      useClass: FindCompanyDataByIdRepositoryImpl,
    },
  ],
})
export class FindCompanyDataByIdModule {}
