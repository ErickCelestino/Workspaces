import { Module } from '@nestjs/common';
import { FindDeviceByIdService } from './find-device-by-id.service';
import { FindDeviceByIdController } from './find-device-by-id.controller';
import { FindDeviceById } from '@workspaces/domain';
import {
  FindDeviceByIdRepositoryImpl,
  FindUserByIdRepositoryImpl,
  PrismaService,
} from '@workspaces/data-access';

@Module({
  controllers: [FindDeviceByIdController],
  providers: [
    FindDeviceByIdService,
    FindDeviceById,
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
  ],
})
export class FindDeviceByIdModule {}
