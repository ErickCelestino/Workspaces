import { Module } from '@nestjs/common';
import { ListDeviceService } from './list-device.service';
import { ListDeviceController } from './list-device.controller';
import { ListDevice } from '@workspaces/domain';
import {
  FindUserByIdRepositoryImpl,
  ListDeviceRepositoryImpl,
  PrismaService,
} from '@workspaces/data-access';

@Module({
  controllers: [ListDeviceController],
  providers: [
    ListDeviceService,
    ListDevice,
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'FindUserByIdRepository',
      useClass: FindUserByIdRepositoryImpl,
    },
    {
      provide: 'ListDeviceRepository',
      useClass: ListDeviceRepositoryImpl,
    },
  ],
})
export class ListDeviceModule {}
