import { Module } from '@nestjs/common';
import { EditDeviceService } from './edit-device.service';
import { EditDeviceController } from './edit-device.controller';
import { EditDevice } from '@workspaces/domain';
import {
  EditDeviceRepositoryImpl,
  FindDeviceByIdRepositoryImpl,
  FindUserByIdRepositoryImpl,
  PrismaGeneralService,
} from '@workspaces/data-access';

@Module({
  controllers: [EditDeviceController],
  providers: [
    EditDeviceService,
    EditDevice,
    {
      provide: 'PrismaService',
      useClass: PrismaGeneralService,
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
      provide: 'EditDeviceRepository',
      useClass: EditDeviceRepositoryImpl,
    },
  ],
})
export class EditDeviceModule {}
