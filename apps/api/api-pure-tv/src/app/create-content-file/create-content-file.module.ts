import { Module } from '@nestjs/common';
import {
  CreateContentFileService,
  CreateContentFileController,
} from '../create-content-file';
import {} from './create-content-file.controller';
import { CreateContentFile } from '@workspaces/domain';
import {
  ConvertBytesToMbRepositoryImpl,
  CreateContentFileRepositoryImpl,
  FindDirectoryByIdRespositoryImpl,
  FindUserByIdRepositoryImpl,
  PrismaService,
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
      provide: 'CreateContentVideoRepository',
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
      provide: 'ConvertBytesToMbRepository',
      useClass: ConvertBytesToMbRepositoryImpl,
    },
  ],
})
export class CreateContentFileModule {}
