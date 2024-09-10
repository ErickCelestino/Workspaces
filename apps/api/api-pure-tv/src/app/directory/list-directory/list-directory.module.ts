import { Module } from '@nestjs/common';
import { ListDirectoryController } from './list-directory.controller';
import { ListDirectoryService } from './list-directory.service';
import { ListDirectory } from '@workspaces/domain';
import {
  FindCompanyByIdRepositoryImpl,
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
      provide: 'FindCompanyByIdRepository',
      useClass: FindCompanyByIdRepositoryImpl,
    },
    {
      provide: 'ListDirectoryRepository',
      useClass: ListDirectoryRepositoryImpl,
    },
  ],
})
export class ListDirectoryModule {}
