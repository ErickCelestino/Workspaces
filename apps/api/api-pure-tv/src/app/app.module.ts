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
  MoveFilesToAnotherPlaylistModule,
  DeletePlaylistFilesModule,
} from './file-to-playlist';
import { ListSimpleDirectoryModule, CreateDirectoryModule } from './directory';
import { CreateSchedulingModule, ListSchedulesModule } from './scheduling';
import { DeleteSchedulingModule } from './delete-scheduling/delete-scheduling.module';

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
    MoveFilesToAnotherPlaylistModule,
    DeletePlaylistFilesModule,
    CreateSchedulingModule,
    ListSchedulesModule,
    DeleteSchedulingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
