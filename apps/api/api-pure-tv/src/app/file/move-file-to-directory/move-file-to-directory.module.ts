import { Module } from '@nestjs/common';
import { MoveFileToDirectoryService } from './move-file-to-directory.service';
import { MoveFileToDirectoryController } from './move-file-to-directory.controller';
import { MoveFileToDirectory } from '@workspaces/domain';
import {
  FindContentFileByIdRepositoryImpl,
  FindDirectoryByIdRepositoryImpl,
  FindUserByIdRepositoryImpl,
  MoveFileToDirectoryRepositoryImpl,
  PrismaService,
} from '@workspaces/data-access';

@Module({
  controllers: [MoveFileToDirectoryController],
  providers: [
    MoveFileToDirectoryService,
    MoveFileToDirectory,
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
      provide: 'FindContentFileByIdRepository',
      useClass: FindContentFileByIdRepositoryImpl,
    },
    {
      provide: 'MoveFileToDirectoryRepository',
      useClass: MoveFileToDirectoryRepositoryImpl,
    },
  ],
})
export class MoveFileToDirectoryModule {}
