import { Module } from '@nestjs/common';
import { EditProfileService } from './edit-profile.service';
import { EditProfileController } from './edit-profile.controller';
import { EditProfile } from '@workspaces/domain';
import {
  EditProfileRepositoryImpl,
  FindUserByIdRepositoryImpl,
  PrismaService,
} from '@workspaces/data-access';

@Module({
  controllers: [EditProfileController],
  providers: [
    EditProfileService,
    EditProfile,
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'FindUserByIdRepository',
      useClass: FindUserByIdRepositoryImpl,
    },
    {
      provide: 'EditProfileRepository',
      useClass: EditProfileRepositoryImpl,
    },
  ],
})
export class EditProfileModule {}
