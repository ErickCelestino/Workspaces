import { Module } from '@nestjs/common';
import { EditPlaylistService } from './edit-playlist.service';
import { EditPlaylistController } from './edit-playlist.controller';
import { EditPlaylist } from '@workspaces/domain';
import {
  EditPlaylistRepositoryImpl,
  FindPlaylistByIdRepositoryImpl,
  FindPlaylistCategoryByIdRepositoryImpl,
  FindUserByIdRepositoryImpl,
  PrismaService,
} from '@workspaces/data-access';

@Module({
  controllers: [EditPlaylistController],
  providers: [
    EditPlaylistService,
    EditPlaylist,
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
      provide: 'FindPlaylistCategoryByIdRepository',
      useClass: FindPlaylistCategoryByIdRepositoryImpl,
    },
    {
      provide: 'EditPlaylistRepository',
      useClass: EditPlaylistRepositoryImpl,
    },
  ],
})
export class EditPlaylistModule {}
