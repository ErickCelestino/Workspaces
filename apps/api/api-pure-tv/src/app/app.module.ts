import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CreateContentFileModule } from './create-content-file/create-content-file.module';
import { MulterModule } from '@nestjs/platform-express';
import { ListContentFileModule } from './list-content-file/list-content-file.module';
import { DeleteContentFileByIdModule } from './delete-content-file-by-id/delete-content-file-by-id.module';
import { DetailsContentFileModule } from './details-content-file/details-content-file.module';
@Module({
  imports: [
    CreateContentFileModule,
    MulterModule.register({
      dest: './uploads',
    }),
    ListContentFileModule,
    DeleteContentFileByIdModule,
    DetailsContentFileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
