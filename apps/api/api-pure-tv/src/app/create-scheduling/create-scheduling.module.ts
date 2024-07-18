import { Module } from '@nestjs/common';
import { CreateSchedulingService } from './create-scheduling.service';
import { CreateSchedulingController } from './create-scheduling.controller';
import { CreateScheduling } from '@workspaces/domain';
import {
  ConvertStringInTimeRepositoryImpl,
  CreateSchedulingRepositoryImpl,
  FindSchedulingByNameRepositoryImpl,
  FindUserByIdRepositoryImpl,
  PrismaService,
} from '@workspaces/data-access';

@Module({
  controllers: [CreateSchedulingController],
  providers: [
    CreateSchedulingService,
    CreateScheduling,
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'FindUserByIdRepository',
      useClass: FindUserByIdRepositoryImpl,
    },
    {
      provide: 'FindSchedulingByNameRepository',
      useClass: FindSchedulingByNameRepositoryImpl,
    },
    {
      provide: 'ConvertStringInTimeRepository',
      useClass: ConvertStringInTimeRepositoryImpl,
    },
    {
      provide: 'CreateSchedulingRepository',
      useClass: CreateSchedulingRepositoryImpl,
    },
  ],
})
export class CreateSchedulingModule {}
