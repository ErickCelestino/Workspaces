import { Module } from '@nestjs/common';
import { DetailsContentFileService } from './details-content-file.service';
import { DetailsContentFileController } from './details-content-file.controller';
import { DetailsContentFile } from '@workspaces/domain';
import {
  FindContentFileByIdRepositoryImpl,
  FindDirectoryByIdRespositoryImpl,
  FindUserByIdRepositoryImpl,
  PrismaService,
} from '@workspaces/data-access';

@Module({
  controllers: [DetailsContentFileController],
  providers: [
    DetailsContentFileService,
    DetailsContentFile,
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
  ],
})
export class DetailsContentFileModule {}
