import { Module } from '@nestjs/common';
import { CreateDeviceService } from './create-device.service';
import { CreateDeviceController } from './create-device.controller';
import { CreateDevice } from '@workspaces/domain';
import {
  CreateDeviceRepositoryImpl,
  FindCompanyByIdRepositoryImpl,
  FindDeviceByNameRepositoryImpl,
  FindUserByIdRepositoryImpl,
  PrismaGeneralService,
} from '@workspaces/data-access';

@Module({
  controllers: [CreateDeviceController],
  providers: [
    CreateDeviceService,
    CreateDevice,
    {
      provide: 'PrismaService',
      useClass: PrismaGeneralService,
    },
    {
      provide: 'FindUserByIdRepository',
      useClass: FindUserByIdRepositoryImpl,
    },
    {
      provide: 'FindDeviceByNameRepository',
      useClass: FindDeviceByNameRepositoryImpl,
    },
    {
      provide: 'FindCompanyByIdRepository',
      useClass: FindCompanyByIdRepositoryImpl,
    },
    {
      provide: 'CreateDeviceRepository',
      useClass: CreateDeviceRepositoryImpl,
    },
  ],
})
export class CreateDeviceModule {}
