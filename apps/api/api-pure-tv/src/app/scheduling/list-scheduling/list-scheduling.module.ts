import { Module } from '@nestjs/common';
import { ListSchedulingService } from './list-scheduling.service';
import { ListSchedulingController } from './list-scheduling.controller';
import { ListScheduling } from '@workspaces/domain';
import {
  FindUserByIdRepositoryImpl,
  ListSchedulingRepositoryImpl,
  PrismaService,
} from '@workspaces/data-access';

@Module({
  controllers: [ListSchedulingController],
  providers: [
    ListSchedulingService,
    ListScheduling,
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'FindUserByIdRepository',
      useClass: FindUserByIdRepositoryImpl,
    },
    {
      provide: 'ListSchedulingRepository',
      useClass: ListSchedulingRepositoryImpl,
    },
  ],
})
export class ListSchedulingModule {}
