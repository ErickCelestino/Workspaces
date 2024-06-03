import { Module } from '@nestjs/common';
import { CreateContentVideoService } from './create-content-video.service';
import { CreateContentVideoController } from './create-content-video.controller';
import { CreateContentVideo } from '@workspaces/domain';
import {
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
  ],
})
export class CreateContentVideoModule {}
