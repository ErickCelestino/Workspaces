import { Module } from '@nestjs/common';
import { CreateUserService } from './create-user.service';
import { CreateUserController } from './create-user.controller';
import {
  CreateUserRepositoryImpl,
  FilterByEmailOrNicknameRepositoryImpl,
  FindAppByIdRepositoryImpl,
  PrismaGeneralService,
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
      provide: 'FindAppByIdRepository',
      useClass: FindAppByIdRepositoryImpl,
    },
    {
      provide: 'PrismaService',
      useClass: PrismaGeneralService,
    },
  ],
})
export class CreateUserModule {}
