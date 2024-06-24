import { Module } from '@nestjs/common';
import { DeleteContentFileByIdService } from './delete-content-file-by-id.service';
import { DeleteContentFileByIdController } from './delete-content-file-by-id.controller';
import {
  DeleteContentFileByIdRepositoryImpl,
  FindContentFileByIdRepositoryImpl,
  FindDirectoryByIdRespositoryImpl,
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
      useClass: FindDirectoryByIdRespositoryImpl,
    },
    {
      provide: 'FindContentFileByIdRepository',
      useClass: FindContentFileByIdRepositoryImpl,
    },
    {
      provide: 'DeleteContentFileByIdRepository',
      useClass: DeleteContentFileByIdRepositoryImpl,
    },
  ],
})
export class DeleteContentFileByIdModule {}