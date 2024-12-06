import { Module } from '@nestjs/common';
import { EditCompanyResponsibleService } from './edit-company-responsible.service';
import { EditCompanyResponsibleController } from './edit-company-responsible.controller';
import { EditCompanyResponsible } from '@workspaces/domain';
import {
  EditCompanyResponsibleRepositoryImpl,
  FindCompanyResponsibleByIdRepositoryImpl,
  FindUserByIdRepositoryImpl,
  PrismaGeneralService,
} from '@workspaces/data-access';

@Module({
  controllers: [EditCompanyResponsibleController],
  providers: [
    EditCompanyResponsibleService,
    EditCompanyResponsible,
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
    {
      provide: 'EditCompanyResponsibleRepository',
      useClass: EditCompanyResponsibleRepositoryImpl,
    },
  ],
})
export class EditCompanyResponsibleModule {}
