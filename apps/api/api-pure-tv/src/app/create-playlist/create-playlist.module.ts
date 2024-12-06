import { Module } from '@nestjs/common';
import { CreatePlaylistService } from './create-playlist.service';
import { CreatePlaylistController } from './create-playlist.controller';
import { CreatePlaylist } from '@workspaces/domain';
import {
  CreatePlaylistRepositoryImpl,
  FindPlaylistByNameRepositoryImpl,
  FindUserByIdRepositoryImpl,
  PrismaGeneralService,
} from '@workspaces/data-access';

@Module({
  controllers: [CreatePlaylistController],
  providers: [
    CreatePlaylistService,
    CreatePlaylist,
    {
      provide: 'PrismaService',
      useClass: PrismaGeneralService,
    },
    {
      provide: 'FindUserByIdRepository',
      useClass: FindUserByIdRepositoryImpl,
    },
    {
      provide: 'FindPlaylistByNameRepository',
      useClass: FindPlaylistByNameRepositoryImpl,
    },
    {
      provide: 'CreatePlaylistRepository',
      useClass: CreatePlaylistRepositoryImpl,
    },
  ],
})
export class CreatePlaylistModule {}
