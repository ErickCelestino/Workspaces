import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CreateUserModule } from './create-user/create-user.module';
import { CreateAuthModule } from './create-auth/create-auth.module';
import { AuthModule } from './auth/auth.module';
import { EditUserModule } from './edit-user/edit-user.module';
import { ListUserModule } from './list-user/list-user.module';

@Module({
  imports: [
    CreateUserModule,
    CreateAuthModule,
    AuthModule,
    ListUserModule,
    EditUserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
