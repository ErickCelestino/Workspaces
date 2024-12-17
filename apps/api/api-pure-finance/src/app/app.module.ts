import { Module } from '@nestjs/common';

import { CreateProductModule, ListProductModule } from './product';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [CreateProductModule, ListProductModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
