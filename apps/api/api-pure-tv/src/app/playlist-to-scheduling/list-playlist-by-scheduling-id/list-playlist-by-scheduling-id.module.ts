import { Module } from '@nestjs/common';
import { ListPlaylistBySchedulingIdService } from './list-playlist-by-scheduling-id.service';
import { ListPlaylistBySchedulingIdController } from './list-playlist-by-scheduling-id.controller';
import { ListPlaylistBySchedulingId } from '@workspaces/domain';
import {
  FindSchedulingByIdRepositoryImpl,
  FindUserByIdRepositoryImpl,
  PrismaService,
  ListPlaylistBySchedulingIdRepositoryImpl,
} from '@workspaces/data-access';

@Module({
  controllers: [ListPlaylistBySchedulingIdController],
  providers: [
    ListPlaylistBySchedulingIdService,
    ListPlaylistBySchedulingId,
    {
      provide: 'PrismaService',
      useClass: PrismaService,
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
      provide: 'ListPlaylistBySchedulingIdRepository',
      useClass: ListPlaylistBySchedulingIdRepositoryImpl,
    },
  ],
})
export class ListPlaylistBySchedulingIdModule {}
