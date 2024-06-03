import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CreateContentVideoModule } from './create-content-video/create-content-video.module';

@Module({
  imports: [CreateContentVideoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
