import { Module } from '@nestjs/common';
import { ListDirectoryController } from './list-directory.controller';
import { ListDirectoryService } from './list-directory.service';
import { ListDirectory } from '@workspaces/domain';
import {
  FindUserByIdRepositoryImpl,
  ListDirectoryRepositoryImpl,
  PrismaService,
} from '@workspaces/data-access';

@Module({
  controllers: [ListDirectoryController],
  providers: [
    ListDirectoryService,
    ListDirectory,
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'FindUserByIdRepository',
      useClass: FindUserByIdRepositoryImpl,
    },
    {
      provide: 'ListDirectoryRepository',
      useClass: ListDirectoryRepositoryImpl,
    },
  ],
})
export class ListDirectoryModule {}
