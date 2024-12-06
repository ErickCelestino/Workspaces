import { Module } from '@nestjs/common';
import { FindSchedulingByIdService } from './find-scheduling-by-id.service';
import { FindSchedulingByIdController } from './find-scheduling-by-id.controller';
import { FindSchedulingById } from '@workspaces/domain';
import {
  FindSchedulingByIdRepositoryImpl,
  FindUserByIdRepositoryImpl,
  PrismaGeneralService,
} from '@workspaces/data-access';

@Module({
  controllers: [FindSchedulingByIdController],
  providers: [
    FindSchedulingByIdService,
    FindSchedulingById,
    {
      provide: 'PrismaService',
      useClass: PrismaGeneralService,
    },
    {
      provide: 'FindUserByIdRepository',
      useClass: FindUserByIdRepositoryImpl,
    },
    {
      provide: 'FindSchedulingByIdRepository',
      useClass: FindSchedulingByIdRepositoryImpl,
    },
  ],
})
export class FindSchedulingByIdModule {}
