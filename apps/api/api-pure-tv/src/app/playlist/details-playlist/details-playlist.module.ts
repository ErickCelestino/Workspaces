import { Module } from '@nestjs/common';
import { DetailsPlaylistService } from './details-playlist.service';
import { DetailsPlaylistController } from './details-playlist.controller';
import { DetailsPlaylist } from '@workspaces/domain';
import {
  DetailsPlaylistRepositoryImpl,
  FindPlaylistByIdRepositoryImpl,
  FindUserByIdRepositoryImpl,
  PrismaService,
} from '@workspaces/data-access';

@Module({
  controllers: [DetailsPlaylistController],
  providers: [
    DetailsPlaylistService,
    DetailsPlaylist,
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
      provide: 'DetailsPlaylistRepository',
      useClass: DetailsPlaylistRepositoryImpl,
    },
  ],
})
export class DetailsPlaylistModule {}
