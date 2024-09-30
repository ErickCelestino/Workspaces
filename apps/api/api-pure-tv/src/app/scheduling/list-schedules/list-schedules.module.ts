import { Module } from '@nestjs/common';
import { ListSchedulesService } from './list-schedules.service';
import { ListSchedulesController } from './list-schedules.controller';
import { ListSchedules } from '@workspaces/domain';
import {
  FindCompanyByIdRepositoryImpl,
  FindUserByIdRepositoryImpl,
  ListSchedulesRepositoryImpl,
  PrismaService,
} from '@workspaces/data-access';

@Module({
  controllers: [ListSchedulesController],
  providers: [
    ListSchedulesService,
    ListSchedules,
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'FindUserByIdRepository',
      useClass: FindUserByIdRepositoryImpl,
    },
    {
      provide: 'FindCompanyByIdRepository',
      useClass: FindCompanyByIdRepositoryImpl,
    },
    {
      provide: 'ListSchedulesRepository',
      useClass: ListSchedulesRepositoryImpl,
    },
  ],
})
export class ListSchedulesModule {}
