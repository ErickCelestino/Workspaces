import { Module } from '@nestjs/common';
import { EditSchedulingService } from './edit-scheduling.service';
import { EditSchedulingController } from './edit-scheduling.controller';
import { EditScheduling } from '@workspaces/domain';
import {
  ConvertStringInTimeRepositoryImpl,
  EditSchedulingRepositoryImpl,
  FindSchedulingByIdRepositoryImpl,
  FindUserByIdRepositoryImpl,
  PrismaService,
} from '@workspaces/data-access';

@Module({
  controllers: [EditSchedulingController],
  providers: [
    EditSchedulingService,
    EditScheduling,
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'FindUserByIdRepository',
      useClass: FindUserByIdRepositoryImpl,
    },
    {
      provide: 'FindSchedulingByIdRepository',
      useClass: FindSchedulingByIdRepositoryImpl,
    },
    {
      provide: 'ConvertStringInTimeRepository',
      useClass: ConvertStringInTimeRepositoryImpl,
    },
    {
      provide: 'EditSchedulingRepository',
      useClass: EditSchedulingRepositoryImpl,
    },
  ],
})
export class EditSchedulingModule {}
