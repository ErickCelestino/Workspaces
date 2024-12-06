import { Module } from '@nestjs/common';
import { FindCompanyResponsibleByIdService } from './find-company-responsible-by-id.service';
import { FindCompanyResponsibleByIdController } from './find-company-responsible-by-id.controller';
import { FindCompanyResponsibleById } from '@workspaces/domain';
import {
  FindCompanyResponsibleByIdRepositoryImpl,
  FindUserByIdRepositoryImpl,
  PrismaGeneralService,
} from '@workspaces/data-access';

@Module({
  controllers: [FindCompanyResponsibleByIdController],
  providers: [
    FindCompanyResponsibleByIdService,
    FindCompanyResponsibleById,
    {
      provide: 'PrismaService',
      useClass: PrismaGeneralService,
    },
    {
      provide: 'FindUserByIdRepository',
      useClass: FindUserByIdRepositoryImpl,
    },
    {
      provide: 'FindCompanyResponsibleByIdRepository',
      useClass: FindCompanyResponsibleByIdRepositoryImpl,
    },
  ],
})
export class FindCompanyResponsibleByIdModule {}
