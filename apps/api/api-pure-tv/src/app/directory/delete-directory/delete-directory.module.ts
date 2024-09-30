import { DeleteDirectory } from '@workspaces/domain';
import { DeleteDirectoryController } from './delete-directory.controller';
import { DeleteDirectoryService } from './delete-directory.service';
import { PrismaService } from 'nestjs-prisma';
import {
  DeleteDirectoryRepositoryImpl,
  FindContentFilesByDirectoryIdRepositoryImpl,
  FindDirectoryByIdRepositoryImpl,
  FindUserByIdRepositoryImpl,
} from '@workspaces/data-access';
import { Module } from '@nestjs/common';

@Module({
  controllers: [DeleteDirectoryController],
  providers: [
    DeleteDirectoryService,
    DeleteDirectory,
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'FindUserByIdRepository',
      useClass: FindUserByIdRepositoryImpl,
    },
    {
      provide: 'FindDirectoryByIdRepository',
      useClass: FindDirectoryByIdRepositoryImpl,
    },
    {
      provide: 'FindContentFilesByDirectoryIdRepository',
      useClass: FindContentFilesByDirectoryIdRepositoryImpl,
    },
    {
      provide: 'DeleteDirectoryRepository',
      useClass: DeleteDirectoryRepositoryImpl,
    },
  ],
})
export class DeleteDirectoryModule {}
