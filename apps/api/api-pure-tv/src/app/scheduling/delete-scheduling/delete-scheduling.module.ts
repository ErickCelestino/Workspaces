import { Module } from '@nestjs/common';
import { DeleteSchedulingService } from './delete-scheduling.service';
import { DeleteSchedulingController } from './delete-scheduling.controller';
import { DeleteScheduling } from '@workspaces/domain';
import {
  DeleteSchedulingRepositoryImpl,
  FindSchedulingByIdRepositoryImpl,
  FindUserByIdRepositoryImpl,
  PrismaService,
} from '@workspaces/data-access';

@Module({
  controllers: [DeleteSchedulingController],
  providers: [
    DeleteSchedulingService,
    DeleteScheduling,
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
      provide: 'DeleteSchedulingRepository',
      useClass: DeleteSchedulingRepositoryImpl,
    },
  ],
})
export class DeleteSchedulingModule {}
