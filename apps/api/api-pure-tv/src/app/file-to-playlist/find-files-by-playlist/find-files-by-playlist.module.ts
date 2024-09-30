import { Module } from '@nestjs/common';
import { FindFilesByPlaylistService } from './find-files-by-playlist.service';
import { FindFilesByPlaylistController } from './find-files-by-playlist.controller';
import { FindFilesByPlaylist } from '@workspaces/domain';
import {
  FindFilesByPlaylistRepositoryImpl,
  FindPlaylistByIdRepositoryImpl,
  FindUserByIdRepositoryImpl,
  PrismaService,
} from '@workspaces/data-access';

@Module({
  controllers: [FindFilesByPlaylistController],
  providers: [
    FindFilesByPlaylistService,
    FindFilesByPlaylist,
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'FindUserByIdRepository',
      useClass: FindUserByIdRepositoryImpl,
    },
    {
      provide: 'FindPlaylistByIdRepository',
      useClass: FindPlaylistByIdRepositoryImpl,
    },
    {
      provide: 'FindFilesByPlaylistRepository',
      useClass: FindFilesByPlaylistRepositoryImpl,
    },
  ],
})
export class FindFilesByPlaylistModule {}
