import { Module } from '@nestjs/common';
import { FindSchedulesByDeviceIdService } from './find-schedules-by-device-id.service';
import { FindSchedulesByDeviceIdController } from './find-schedules-by-device-id.controller';
import { FindSchedulesByDeviceId } from '@workspaces/domain';
import {
  FindDeviceByIdRepositoryImpl,
  FindSchedulesByDeviceIdRepositoryImpl,
  FindUserByIdRepositoryImpl,
  PrismaService,
} from '@workspaces/data-access';

@Module({
  controllers: [FindSchedulesByDeviceIdController],
  providers: [
    FindSchedulesByDeviceIdService,
    FindSchedulesByDeviceId,
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
      provide: 'FindSchedulesByDeviceIdRepository',
      useClass: FindSchedulesByDeviceIdRepositoryImpl,
    },
  ],
})
export class FindSchedulesByDeviceIdModule {}
