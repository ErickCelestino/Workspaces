import { Module } from '@nestjs/common';
import { DeletePlaylistToSchedulingService } from './delete-playlist-to-scheduling.service';
import { DeletePlaylistToSchedulingController } from './delete-playlist-to-scheduling.controller';
import { DeletePlaylistToScheduling } from '@workspaces/domain';
import {
  DeletePlaylistToSchedulingRepositoryImpl,
  FindPlaylistByIdRepositoryImpl,
  FindSchedulingByIdRepositoryImpl,
  FindUserByIdRepositoryImpl,
  PrismaGeneralService,
} from '@workspaces/data-access';

@Module({
  controllers: [DeletePlaylistToSchedulingController],
  providers: [
    DeletePlaylistToSchedulingService,
    DeletePlaylistToScheduling,
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
      provide: 'DeletePlaylistToSchedulingRepository',
      useClass: DeletePlaylistToSchedulingRepositoryImpl,
    },
  ],
})
export class DeletePlaylistToSchedulingModule {}
