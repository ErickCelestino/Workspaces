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
  DownloadContentFileModule,
  MoveFileToDirectoryModule,
} from './file';
import { FileS3Storage } from '@workspaces/data-access';
import { CreatePlaylistCategoryModule } from './create-playlist-category/create-playlist-category.module';
import { ListPlaylistCategoryModule } from './list-playlist-category/list-playlist-category.module';
import { FindPlaylistCategoryByIdModule } from './find-playlist-category-by-id/find-playlist-category-by-id.module';

@Module({
  imports: [
    CreateContentFileModule,
    MulterModule.registerAsync({
      useFactory: () => ({
        storage: FileS3Storage.Storage,
      }),
    }),
    ListContentFileModule,
    DeleteContentFileByIdModule,
    DetailsContentFileModule,
    EditContentFileModule,
    DownloadContentFileModule,
    MoveFileToDirectoryModule,
    CreatePlaylistCategoryModule,
    ListPlaylistCategoryModule,
    FindPlaylistCategoryByIdModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
