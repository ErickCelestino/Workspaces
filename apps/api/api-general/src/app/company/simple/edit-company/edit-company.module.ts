import { Module } from '@nestjs/common';
import { EditCompanyService } from './edit-company.service';
import { EditCompanyController } from './edit-company.controller';
import { EditCompany } from '@workspaces/domain';
import {
  EditCompanyRepositoryImpl,
  FindCompanyByIdRepositoryImpl,
  FindUserByIdRepositoryImpl,
  PrismaGeneralService,
} from '@workspaces/data-access';

@Module({
  controllers: [EditCompanyController],
  providers: [
    EditCompanyService,
    EditCompany,
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
      provide: 'EditCompanyRepository',
      useClass: EditCompanyRepositoryImpl,
    },
  ],
})
export class EditCompanyModule {}
