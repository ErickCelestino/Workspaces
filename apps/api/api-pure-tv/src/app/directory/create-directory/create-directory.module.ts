import { Module } from '@nestjs/common';
import { CreateDirectoryController } from './create-directory.controller';
import { CreateDirectoryService } from './create-directory.service';
import { CreateDirectory } from '@workspaces/domain';
import {
  CreateDirectoryRepositoryImpl,
  FindDirectoryByNameRepositoryImpl,
  FindUserByIdRepositoryImpl,
  PrismaService,
} from '@workspaces/data-access';

@Module({
  controllers: [CreateDirectoryController],
  providers: [
    CreateDirectoryService,
    CreateDirectory,
    {
      provide: 'CreateDirectoryRepository',
      useClass: CreateDirectoryRepositoryImpl,
    },
    {
      provide: 'FindUserByIdRepository',
      useClass: FindUserByIdRepositoryImpl,
    },
    {
      provide: 'FindDirectoryByNameRepository',
      useClass: FindDirectoryByNameRepositoryImpl,
    },
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
  ],
})
export class CreateDirectoryModule {}
