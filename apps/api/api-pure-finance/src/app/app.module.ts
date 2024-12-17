import { Module } from '@nestjs/common';

import {
  CreateProductModule,
  ListProductModule,
  DeleteProductModule,
} from './product';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [CreateProductModule, ListProductModule, DeleteProductModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
