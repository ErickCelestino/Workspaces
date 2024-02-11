import { Module } from '@nestjs/common';
import { CreateUserService } from './create-user.service';
import { CreateUserController } from './create-user.controller';
import { PrismaService } from '../../prisma.service';
import {
  CreateUserRepositoryImpl,
  FilterByEmailOrNicknameRepositoryImpl,
} from '@workspaces/data-access';
import { CreateUser } from '@workspaces/domain';

@Module({
  controllers: [CreateUserController],
  providers: [
    CreateUser,
    CreateUserService,
    {
      provide: 'CreateUserRepository',
      useClass: CreateUserRepositoryImpl,
    },
    {
      provide: 'FilterByEmailOrNicknameRepository',
      useClass: FilterByEmailOrNicknameRepositoryImpl,
    },
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
  ],
})
export class CreateUserModule {}
