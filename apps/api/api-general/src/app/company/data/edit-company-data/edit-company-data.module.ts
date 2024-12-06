import { Module } from '@nestjs/common';
import { EditCompanyDataService } from './edit-company-data.service';
import { EditCompanyDataController } from './edit-company-data.controller';
import { EditCompanyData } from '@workspaces/domain';
import {
  EditCompanyDataRepositoryImpl,
  FindCompanyDataByIdRepositoryImpl,
  FindUserByIdRepositoryImpl,
  PrismaGeneralService,
} from '@workspaces/data-access';

@Module({
  controllers: [EditCompanyDataController],
  providers: [
    EditCompanyDataService,
    EditCompanyData,
    {
      provide: 'PrismaService',
      useClass: PrismaGeneralService,
    },
    {
      provide: 'FindUserByIdRepository',
      useClass: FindUserByIdRepositoryImpl,
    },
    {
      provide: 'FindCompanyDataByIdRepository',
      useClass: FindCompanyDataByIdRepositoryImpl,
    },
    {
      provide: 'EditCompanyDataRepository',
      useClass: EditCompanyDataRepositoryImpl,
    },
  ],
})
export class EditCompanyDataModule {}
