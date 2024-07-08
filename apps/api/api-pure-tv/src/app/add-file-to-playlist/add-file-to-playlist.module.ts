import { Module } from '@nestjs/common';
import { AddFileToPlaylistService } from './add-file-to-playlist.service';
import { AddFileToPlaylistController } from './add-file-to-playlist.controller';
import { AddFileToPlaylist } from '@workspaces/domain';
import {
  AddFileToPlaylistRepositoryImpl,
  FindContentFileByIdRepositoryImpl,
  FindFileInFileToPlaylistRepositoryImpl,
  FindPlaylistByIdRepositoryImpl,
  FindUserByIdRepositoryImpl,
  PrismaService,
} from '@workspaces/data-access';

@Module({
  controllers: [AddFileToPlaylistController],
  providers: [
    AddFileToPlaylistService,
    AddFileToPlaylist,
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'FindUserByIdRepository',
      useClass: FindUserByIdRepositoryImpl,
    },
    {
      provide: 'FindContentFileByIdRepository',
      useClass: FindContentFileByIdRepositoryImpl,
    },
    {
      provide: 'FindPlaylistByIdRepository',
      useClass: FindPlaylistByIdRepositoryImpl,
    },
    {
      provide: 'AddFileToPlaylistRepository',
      useClass: AddFileToPlaylistRepositoryImpl,
    },
    {
      provide: 'FindFileInFileToPlaylistRepository',
      useClass: FindFileInFileToPlaylistRepositoryImpl,
    },
  ],
})
export class AddFileToPlaylistModule {}
