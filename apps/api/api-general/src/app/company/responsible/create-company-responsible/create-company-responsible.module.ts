import { Module } from '@nestjs/common';
import { CreateCompanyResponsibleService } from './create-company-responsible.service';
import { CreateCompanyResponsibleController } from './create-company-responsible.controller';
import { CreateCompanyResponsible } from '@workspaces/domain';
import {
  CreateCompanyResponsibleRespositoryImpl,
  FindCompanyByIdRepositoryImpl,
  FindCompanyResponsibleByDocumentRepositoryImpl,
  FindUserByIdRepositoryImpl,
  PrismaService,
} from '@workspaces/data-access';

@Module({
  controllers: [CreateCompanyResponsibleController],
  providers: [
    CreateCompanyResponsibleService,
    CreateCompanyResponsible,
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
      provide: 'FindCompanyResponsibleByDocumentRepository',
      useClass: FindCompanyResponsibleByDocumentRepositoryImpl,
    },
    {
      provide: 'CreateCompanyResponsibleRespository',
      useClass: CreateCompanyResponsibleRespositoryImpl,
    },
  ],
})
export class CreateCompanyResponsibleModule {}
