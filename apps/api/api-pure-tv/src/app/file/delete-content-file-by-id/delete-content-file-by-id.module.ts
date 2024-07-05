import { Module } from '@nestjs/common';
import { DeleteContentFileByIdService } from './delete-content-file-by-id.service';
import { DeleteContentFileByIdController } from './delete-content-file-by-id.controller';
import {
  DeleleteFileByNameRepositoryImpl,
  DeleteContentFileByIdRepositoryImpl,
  FindContentFileByIdRepositoryImpl,
  FindDirectoryByIdRepositoryImpl,
  FindUserByIdRepositoryImpl,
  PrismaService,
} from '@workspaces/data-access';
import { DeleteContentFileById } from '@workspaces/domain';

@Module({
  controllers: [DeleteContentFileByIdController],
  providers: [
    DeleteContentFileByIdService,
    DeleteContentFileById,
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
      provide: 'DeleteContentFileByIdRepository',
      useClass: DeleteContentFileByIdRepositoryImpl,
    },
    {
      provide: 'DeleteFileByNameRepository',
      useClass: DeleleteFileByNameRepositoryImpl,
    },
  ],
})
export class DeleteContentFileByIdModule {}
