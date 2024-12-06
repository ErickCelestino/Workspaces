import { Module } from '@nestjs/common';
import { AddPlaylistsToSchedulingService } from './add-playlists-to-scheduling.service';
import { AddPlaylistsToSchedulingController } from './add-playlists-to-scheduling.controller';
import {
  AddPlaylistToSchedulingRepositoryImpl,
  FindPlaylistByIdRepositoryImpl,
  FindPlaylistToSchedulingByIdsRepositoryImpl,
  FindSchedulingByIdRepositoryImpl,
  FindUserByIdRepositoryImpl,
  PrismaGeneralService,
} from '@workspaces/data-access';
import { AddPlaylistsToScheduling } from '@workspaces/domain';

@Module({
  controllers: [AddPlaylistsToSchedulingController],
  providers: [
    AddPlaylistsToSchedulingService,
    AddPlaylistsToScheduling,
    {
      provide: 'PrismaService',
      useClass: PrismaGeneralService,
    },
    {
      provide: 'FindUserByIdRepository',
      useClass: FindUserByIdRepositoryImpl,
    },
    {
      provide: 'FindSchedulingByIdRepository',
      useClass: FindSchedulingByIdRepositoryImpl,
    },
    {
      provide: 'FindPlaylistByIdRepository',
      useClass: FindPlaylistByIdRepositoryImpl,
    },
    {
      provide: 'FindPlaylistToSchedulingByIdsRepository',
      useClass: FindPlaylistToSchedulingByIdsRepositoryImpl,
    },
    {
      provide: 'AddPlaylistToSchedulingRepository',
      useClass: AddPlaylistToSchedulingRepositoryImpl,
    },
  ],
})
export class AddPlaylistsToSchedulingModule {}
