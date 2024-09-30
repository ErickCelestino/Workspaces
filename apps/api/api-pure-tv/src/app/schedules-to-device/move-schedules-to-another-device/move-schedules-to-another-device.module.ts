import { Module } from '@nestjs/common';
import { MoveSchedulesToAnotherDeviceService } from './move-schedules-to-another-device.service';
import { MoveSchedulesToAnotherDeviceController } from './move-schedules-to-another-device.controller';
import { MoveSchedulesToAnotherDevice } from '@workspaces/domain';
import {
  FindDeviceByIdRepositoryImpl,
  FindSchedulingByIdRepositoryImpl,
  FindSchedulingToDeviceByIdsRepositoryImpl,
  FindUserByIdRepositoryImpl,
  MoveSchedulingToAnotherDeviceRepositoryImpl,
  PrismaService,
} from '@workspaces/data-access';

@Module({
  controllers: [MoveSchedulesToAnotherDeviceController],
  providers: [
    MoveSchedulesToAnotherDeviceService,
    MoveSchedulesToAnotherDevice,
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'FindUserByIdRepository',
      useClass: FindUserByIdRepositoryImpl,
    },
    {
      provide: 'FindDeviceByIdRepository',
      useClass: FindDeviceByIdRepositoryImpl,
    },
    {
      provide: 'FindSchedulingByIdRepository',
      useClass: FindSchedulingByIdRepositoryImpl,
    },
    {
      provide: 'FindSchedulingToDeviceByIdsRepository',
      useClass: FindSchedulingToDeviceByIdsRepositoryImpl,
    },
    {
      provide: 'MoveSchedulingToAnotherDeviceRepository',
      useClass: MoveSchedulingToAnotherDeviceRepositoryImpl,
    },
  ],
})
export class MoveSchedulesToAnotherDeviceModule {}
