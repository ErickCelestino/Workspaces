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
import { ListSimpleStateModule, ListSimpleCountryModule } from './address';
import { ListSimpleCityModule } from './list-simple-city/list-simple-city.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
