import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CreateAuthModule, AuthModule } from './authentication';
import {
  ListUserModule,
  FindUserByIdModule,
  EditUserModule,
  DeleteUserByIdModule,
  CreateUserModule,
  FindUserByEmailModule,
} from './user';
import {
  CreateCompanyModule,
  ConsultCompanyByCnpjModule,
  CreateCompanyDataModule,
  CreateCompanyAddressModule,
  CreateCompanyResponsibleModule,
  ListCompanyModule,
  DeleteCompanyByIdModule,
  EditCompanyModule,
  FindSimpleCompanyByIdModule,
  EditCompanyDataModule,
} from './company';
import {
  ListSimpleStateModule,
  ListSimpleCountryModule,
  ListSimpleCityModule,
  ConsultZipcodeModule,
} from './address';
import { FindCompanyDataByIdModule } from './find-company-data-by-id/find-company-data-by-id.module';

@Module({
  imports: [
    CreateUserModule,
    CreateAuthModule,
    AuthModule,
    ListUserModule,
    EditUserModule,
    FindUserByIdModule,
    DeleteUserByIdModule,
    FindUserByEmailModule,
    CreateCompanyModule,
    ConsultCompanyByCnpjModule,
    CreateCompanyDataModule,
    CreateCompanyAddressModule,
    ListSimpleStateModule,
    ListSimpleCountryModule,
    ListSimpleCityModule,
    CreateCompanyResponsibleModule,
    ConsultZipcodeModule,
    ListCompanyModule,
    DeleteCompanyByIdModule,
    EditCompanyModule,
    FindSimpleCompanyByIdModule,
    EditCompanyDataModule,
    FindCompanyDataByIdModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
