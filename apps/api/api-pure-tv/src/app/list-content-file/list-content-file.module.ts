import { Module } from '@nestjs/common';
import { ListContentFileService } from './list-content-file.service';
import { ListContentFileController } from './list-content-file.controller';
import { ListContentFile } from '@workspaces/domain';
import {
  FindDirectoryByIdRespositoryImpl,
  FindUserByIdRepositoryImpl,
  ListContentFileRepositoryImpl,
  PrismaService,
} from '@workspaces/data-access';

@Module({
  controllers: [ListContentFileController],
  providers: [
    ListContentFileService,
    ListContentFile,
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'ListContentFileRepository',
      useClass: ListContentFileRepositoryImpl,
    },
    {
      provide: 'FindUserByIdRepository',
      useClass: FindUserByIdRepositoryImpl,
    },
    {
      provide: 'FindDirectoryByIdRepository',
      useClass: FindDirectoryByIdRespositoryImpl,
    },
  ],
})
export class ListContentFileModule {}
