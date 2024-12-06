import { Module } from '@nestjs/common';
import { MoveFileToDirectoryService } from './move-file-to-directory.service';
import { MoveFileToDirectoryController } from './move-file-to-directory.controller';
import { MoveFileToDirectory } from '@workspaces/domain';
import {
  FindContentFileByIdRepositoryImpl,
  FindDirectoryByIdRepositoryImpl,
  FindUserByIdRepositoryImpl,
  MoveFileToDirectoryRepositoryImpl,
  PrismaGeneralService,
} from '@workspaces/data-access';

@Module({
  controllers: [MoveFileToDirectoryController],
  providers: [
    MoveFileToDirectoryService,
    MoveFileToDirectory,
    {
      provide: 'PrismaService',
      useClass: PrismaGeneralService,
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
