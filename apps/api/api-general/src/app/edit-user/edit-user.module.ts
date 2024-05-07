import { Module } from '@nestjs/common';
import { EditUserService } from './edit-user.service';
import { EditUserController } from './edit-user.controller';
import {
  EditUserRepositoryImpl,
  FindUserByIdRepositoryImpl,
  PrismaService,
} from '@workspaces/data-access';
import { EditUser } from '@workspaces/domain';

@Module({
  controllers: [EditUserController],
  providers: [
    EditUserService,
    EditUser,
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'EditUserRepository',
      useClass: EditUserRepositoryImpl,
    },
    {
      provide: 'FindUserByIdRepository',
      useClass: FindUserByIdRepositoryImpl,
    },
  ],
})
export class EditUserModule {}
