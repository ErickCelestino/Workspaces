import { Module } from '@nestjs/common';
import { DownloadContentFileService } from './download-content-file.service';
import { DownloadContentFileController } from './download-content-file.controller';
import { DownloadContentFile } from '@workspaces/domain';
import {
  DownloadContentFileRepositoryImpl,
  FindContentFileByIdRepositoryImpl,
  FindDirectoryByIdRepositoryImpl,
  FindUserByIdRepositoryImpl,
  PrismaService,
} from '@workspaces/data-access';

@Module({
  controllers: [DownloadContentFileController],
  providers: [
    DownloadContentFileService,
    DownloadContentFile,
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
      provide: 'DownloadContentFileRepository',
      useClass: DownloadContentFileRepositoryImpl,
    },
  ],
})
export class DownloadContentFileModule {}
