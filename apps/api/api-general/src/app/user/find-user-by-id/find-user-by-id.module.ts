import { Module } from '@nestjs/common';
import { FindUserByIdService } from './find-user-by-id.service';
import { FindUserByIdController } from './find-user-by-id.controller';
import {
  FindUserByIdRepositoryImpl,
  PrismaService,
} from '@workspaces/data-access';
import { FindUserById } from '@workspaces/domain';

@Module({
  controllers: [FindUserByIdController],
  providers: [
    FindUserByIdService,
    FindUserById,
    {
      provide: 'FindUserByIdRepository',
      useClass: FindUserByIdRepositoryImpl,
    },
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
  ],
})
export class FindUserByIdModule {}
