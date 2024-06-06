import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CreateContentVideoModule } from './create-content-video/create-content-video.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    CreateContentVideoModule,
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
