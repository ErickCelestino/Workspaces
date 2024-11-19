import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CreatePreRegistrationModule } from './create-pre-registration/create-pre-registration.module';

@Module({
  imports: [CreatePreRegistrationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
