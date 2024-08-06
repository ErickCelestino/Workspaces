import { Module } from '@nestjs/common';
import { DeleteDeviceService } from './delete-device.service';
import { DeleteDeviceController } from './delete-device.controller';
import { DeleteDevice } from '@workspaces/domain';
import {
  DeleteDeviceRepositoryImpl,
  FindDeviceByIdRepositoryImpl,
  FindUserByIdRepositoryImpl,
  PrismaService,
} from '@workspaces/data-access';

@Module({
  controllers: [DeleteDeviceController],
  providers: [
    DeleteDeviceService,
    DeleteDevice,
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
      provide: 'DeleteDeviceRepository',
      useClass: DeleteDeviceRepositoryImpl,
    },
  ],
})
export class DeleteDeviceModule {}
