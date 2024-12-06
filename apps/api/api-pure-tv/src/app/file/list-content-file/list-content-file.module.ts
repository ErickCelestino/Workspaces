import { Module } from '@nestjs/common';
import { ListContentFileService } from './list-content-file.service';
import { ListContentFileController } from './list-content-file.controller';
import { ListContentFile } from '@workspaces/domain';
import {
  FindCompanyByIdRepositoryImpl,
  FindDirectoryByIdRepositoryImpl,
  FindUserByIdRepositoryImpl,
  ListContentFileRepositoryImpl,
  PrismaGeneralService,
} from '@workspaces/data-access';

@Module({
  controllers: [ListContentFileController],
  providers: [
    ListContentFileService,
    ListContentFile,
    {
      provide: 'PrismaService',
      useClass: PrismaGeneralService,
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
      provide: 'FindCompanyByIdRepository',
      useClass: FindCompanyByIdRepositoryImpl,
    },
    {
      provide: 'FindDirectoryByIdRepository',
      useClass: FindDirectoryByIdRepositoryImpl,
    },
  ],
})
export class ListContentFileModule {}
