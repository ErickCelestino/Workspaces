import { Module } from '@nestjs/common';
import { DeletePlaylistService } from './delete-playlist.service';
import { DeletePlaylistController } from './delete-playlist.controller';
import { DeletePlaylist } from '@workspaces/domain';
import {
  DeletePlaylistRepositoryImpl,
  FindPlaylistByIdRepositoryImpl,
  FindUserByIdRepositoryImpl,
  PrismaService,
} from '@workspaces/data-access';

@Module({
  controllers: [DeletePlaylistController],
  providers: [
    DeletePlaylistService,
    DeletePlaylist,
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
      provide: 'DeletePlaylistRepoistory',
      useClass: DeletePlaylistRepositoryImpl,
    },
  ],
})
export class DeletePlaylistModule {}
