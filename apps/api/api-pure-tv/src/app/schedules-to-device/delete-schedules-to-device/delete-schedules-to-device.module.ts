import { Module } from '@nestjs/common';
import { DeleteSchedulesToDeviceService } from './delete-schedules-to-device.service';
import { DeleteSchedulesToDeviceController } from './delete-schedules-to-device.controller';
import { DeleteSchedulesToDevice } from '@workspaces/domain';
import {
  DeleteSchedulingToDeviceRepositoryImpl,
  FindDeviceByIdRepositoryImpl,
  FindSchedulingByIdRepositoryImpl,
  FindSchedulingToDeviceByIdsRepositoryImpl,
  FindUserByIdRepositoryImpl,
  PrismaService,
} from '@workspaces/data-access';

@Module({
  controllers: [DeleteSchedulesToDeviceController],
  providers: [
    DeleteSchedulesToDeviceService,
    DeleteSchedulesToDevice,
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
      provide: 'DeleteSchedulingToDeviceRepository',
      useClass: DeleteSchedulingToDeviceRepositoryImpl,
    },
  ],
})
export class DeleteSchedulesToDeviceModule {}
