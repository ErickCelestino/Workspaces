import { Module } from '@nestjs/common';
import { ConsultCompanyByCnpjService } from './consult-company-by-cnpj.service';
import { ConsultCompanyByCnpjController } from './consult-company-by-cnpj.controller';
import { ConsultCompanyByCnpj } from '@workspaces/domain';
import {
  ConsultCompanyByCnpjRepositoryImpl,
  FindCompanyByCnpjRepositoryImpl,
  FindUserByIdRepositoryImpl,
  PrismaService,
} from '@workspaces/data-access';

@Module({
  controllers: [ConsultCompanyByCnpjController],
  providers: [
    ConsultCompanyByCnpjService,
    ConsultCompanyByCnpj,
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'FindUserByIdRepository',
      useClass: FindUserByIdRepositoryImpl,
    },
    {
      provide: 'FindCompanyByCnpjRepository',
      useClass: FindCompanyByCnpjRepositoryImpl,
    },
    {
      provide: 'ConsultCompanyByCnpjRepository',
      useClass: ConsultCompanyByCnpjRepositoryImpl,
    },
  ],
})
export class ConsultCompanyByCnpjModule {}
