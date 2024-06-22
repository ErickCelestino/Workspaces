import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MulterModule } from '@nestjs/platform-express';
import {
  ListContentFileModule,
  EditContentFileModule,
  DetailsContentFileModule,
  DeleteContentFileByIdModule,
  CreateContentFileModule,
} from './file';

@Module({
  imports: [
    CreateContentFileModule,
    MulterModule.register({
      dest: './uploads',
    }),
    ListContentFileModule,
    DeleteContentFileByIdModule,
    DetailsContentFileModule,
    EditContentFileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
