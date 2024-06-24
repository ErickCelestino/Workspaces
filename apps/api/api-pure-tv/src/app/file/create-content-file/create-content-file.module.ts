import { Module } from '@nestjs/common';
import { CreateContentFileService } from './create-content-file.service';
import { CreateContentFileController } from './create-content-file.controller';
import { CreateContentFile } from '@workspaces/domain';
import {
  CreateContentFileRepositoryImpl,
  FindDirectoryByIdRespositoryImpl,
  FindUserByIdRepositoryImpl,
  PrismaService,
  UploadFileRepositoryImpl,
} from '@workspaces/data-access';

@Module({
  controllers: [CreateContentFileController],
  providers: [
    CreateContentFileService,
    CreateContentFile,
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'CreateContentFileRepository',
      useClass: CreateContentFileRepositoryImpl,
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
      provide: 'UploadFileRepository',
      useClass: UploadFileRepositoryImpl,
    },
  ],
})
export class CreateContentFileModule {}
