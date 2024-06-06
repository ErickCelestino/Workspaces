import { Module } from '@nestjs/common';
import {
  CreateContentVideoService,
  CreateContentVideoController,
} from '../create-content-video';
import { CreateContentVideo } from '@workspaces/domain';
import {
  ConvertBytesToMbRepositoryImpl,
  CreateContentVideoRepositoryImpl,
  FindDirectoryByIdRespositoryImpl,
  FindUserByIdRepositoryImpl,
  PrismaService,
} from '@workspaces/data-access';

@Module({
  controllers: [CreateContentVideoController],
  providers: [
    CreateContentVideoService,
    CreateContentVideo,
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'CreateContentVideoRepository',
      useClass: CreateContentVideoRepositoryImpl,
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
export class CreateContentVideoModule {}
