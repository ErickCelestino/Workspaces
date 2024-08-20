import { ListUser } from '@workspaces/domain';
import { ListUserController } from './list-user.controller';
import { ListUserService } from './list-user.service';
import {
  BtrinSanitizeRepositoryImpl,
  FindUserByIdRepositoryImpl,
  ListUserRepositoryImpl,
  PrismaService,
  VerifyUserPermissionsByIdRepositoryImpl,
} from '@workspaces/data-access';
import { Module } from '@nestjs/common';

@Module({
  controllers: [ListUserController],
  providers: [
    ListUser,
    ListUserService,
    {
      provide: 'ListUserRepository',
      useClass: ListUserRepositoryImpl,
    },
    {
      provide: 'BtrinSanatizeRepository',
      useClass: BtrinSanitizeRepositoryImpl,
    },
    {
      provide: 'FindUserByIdRepository',
      useClass: FindUserByIdRepositoryImpl,
    },
    {
      provide: 'VerifyUserPermissionsByIdRepository',
      useClass: VerifyUserPermissionsByIdRepositoryImpl,
    },
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
  ],
})
export class ListUserModule {}
