import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CreateContentFileModule } from './create-content-file/create-content-file.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    CreateContentFileModule,
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
