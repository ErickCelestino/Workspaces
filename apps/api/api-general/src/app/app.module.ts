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
} from './company';
import { CreateCompanyAddressModule } from './create-company-address/create-company-address.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
