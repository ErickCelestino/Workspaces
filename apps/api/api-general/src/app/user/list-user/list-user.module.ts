import { ListUser } from '@workspaces/domain';
import { ListUserController } from './list-user.controller';
import { ListUserService } from './list-user.service';
import {
  BtrinSanitizeRepositoryImpl,
  ListUserRepositoryImpl,
  PrismaService,
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
      provide: 'PrismaService',
      useClass: PrismaService,
    },
  ],
})
export class ListUserModule {}
