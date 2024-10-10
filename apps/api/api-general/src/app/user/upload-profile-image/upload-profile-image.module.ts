import { Module } from '@nestjs/common';
import { UploadProfileImageService } from './upload-profile-image.service';
import { UploadProfileImageController } from './upload-profile-image.controller';
import { UploadProfileImage } from '@workspaces/domain';
import {
  FindUserByIdRepositoryImpl,
  PrismaService,
  RegisterProfileImageRepositoryImpl,
  UploadContentFileRepositoryImpl,
} from '@workspaces/data-access';

@Module({
  controllers: [UploadProfileImageController],
  providers: [
    UploadProfileImageService,
    UploadProfileImage,
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'FindUserByIdRepository',
      useClass: FindUserByIdRepositoryImpl,
    },
    {
      provide: 'UploadContentFileRepository',
      useClass: UploadContentFileRepositoryImpl,
    },
    {
      provide: 'RegisterProfileImageRepository',
      useClass: RegisterProfileImageRepositoryImpl,
    },
  ],
})
export class UploadProfileImageModule {}
