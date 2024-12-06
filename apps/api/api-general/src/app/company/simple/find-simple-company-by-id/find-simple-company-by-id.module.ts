import { Module } from '@nestjs/common';
import { FindSimpleCompanyByIdService } from './find-simple-company-by-id.service';
import { FindSimpleCompanyByIdController } from './find-simple-company-by-id.controller';
import { FindSimpleCompanyById } from '@workspaces/domain';
import {
  FindSimpleCompanyByIdRepositoryImpl,
  FindUserByIdRepositoryImpl,
  PrismaGeneralService,
} from '@workspaces/data-access';

@Module({
  controllers: [FindSimpleCompanyByIdController],
  providers: [
    FindSimpleCompanyByIdService,
    FindSimpleCompanyById,
    {
      provide: 'PrismaService',
      useClass: PrismaGeneralService,
    },
    {
      provide: 'FindUserByIdRepository',
      useClass: FindUserByIdRepositoryImpl,
    },
    {
      provide: 'FindSimpleCompanyByIdRepository',
      useClass: FindSimpleCompanyByIdRepositoryImpl,
    },
  ],
})
export class FindSimpleCompanyByIdModule {}
