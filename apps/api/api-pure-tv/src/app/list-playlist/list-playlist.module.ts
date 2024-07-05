import { Module } from '@nestjs/common';
import { ListPlaylistService } from './list-playlist.service';
import { ListPlaylistController } from './list-playlist.controller';
import { ListPlaylist } from '@workspaces/domain';
import {
  FindUserByIdRepositoryImpl,
  ListPlaylistRepositoryImpl,
  PrismaService,
} from '@workspaces/data-access';

@Module({
  controllers: [ListPlaylistController],
  providers: [
    ListPlaylistService,
    ListPlaylist,
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'FindUserByIdRepository',
      useClass: FindUserByIdRepositoryImpl,
    },
    {
      provide: 'ListPlaylistRepository',
      useClass: ListPlaylistRepositoryImpl,
    },
  ],
})
export class ListPlaylistModule {}
