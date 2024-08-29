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
} from './company';
import {
  ListSimpleStateModule,
  ListSimpleCountryModule,
  ListSimpleCityModule,
} from './address';
import { CreateCompanyResponsibleModule } from './create-company-responsible/create-company-responsible.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
