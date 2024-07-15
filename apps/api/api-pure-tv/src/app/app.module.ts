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
  DetailsPlaylistModule,
} from './playlist';
import {
  AddFileToPlaylistModule,
  FindFilesByPlaylistModule,
} from './file-to-playlist';
import { ListSimpleDirectoryModule, CreateDirectoryModule } from './directory';

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
    ListSimpleDirectoryModule,
    DetailsPlaylistModule,
    FindFilesByPlaylistModule,
    CreateDirectoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
