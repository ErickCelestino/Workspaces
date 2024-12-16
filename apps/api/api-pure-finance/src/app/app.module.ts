import { Module } from '@nestjs/common';

import { CreateProductModule } from './product';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [CreateProductModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
