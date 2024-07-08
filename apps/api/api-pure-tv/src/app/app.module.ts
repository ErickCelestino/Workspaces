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
import {
  CreatePlaylistCategoryModule,
  ListPlaylistCategoryModule,
  EditPlaylistCategoryModule,
  FindPlaylistCategoryByIdModule,
  DeletePlaylistCategoryModule,
} from './playlist-category';
import {
  CreatePlaylistModule,
  ListPlaylistModule,
  FindPlaylistByIdModule,
  EditPlaylistModule,
  DeletePlaylistModule,
} from './playlist';
import { AddFileToPlaylistModule } from './add-file-to-playlist/add-file-to-playlist.module';

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
    EditPlaylistCategoryModule,
    FindPlaylistCategoryByIdModule,
    DeletePlaylistCategoryModule,
    CreatePlaylistModule,
    ListPlaylistModule,
    FindPlaylistByIdModule,
    EditPlaylistModule,
    DeletePlaylistModule,
    AddFileToPlaylistModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
