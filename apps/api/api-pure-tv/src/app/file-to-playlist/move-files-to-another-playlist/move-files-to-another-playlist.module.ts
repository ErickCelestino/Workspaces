import { Module } from '@nestjs/common';
import { MoveFilesToAnotherPlaylistService } from './move-files-to-another-playlist.service';
import { MoveFilesToAnotherPlaylistController } from './move-files-to-another-playlist.controller';
import { MoveFilesToAnotherPlaylist } from '@workspaces/domain';
import {
  FindContentFileByIdRepositoryImpl,
  FindFileInFileToPlaylistRepositoryImpl,
  FindPlaylistByIdRepositoryImpl,
  FindUserByIdRepositoryImpl,
  MoveFileToAnotherPlaylistRepositoryImpl,
  PrismaService,
} from '@workspaces/data-access';

@Module({
  controllers: [MoveFilesToAnotherPlaylistController],
  providers: [
    MoveFilesToAnotherPlaylistService,
    MoveFilesToAnotherPlaylist,
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
      provide: 'FindFileInFileToPlaylistRepository',
      useClass: FindFileInFileToPlaylistRepositoryImpl,
    },
    {
      provide: 'MoveFileToAnotherPlaylistRepository',
      useClass: MoveFileToAnotherPlaylistRepositoryImpl,
    },
  ],
})
export class MoveFilesToAnotherPlaylistModule {}
