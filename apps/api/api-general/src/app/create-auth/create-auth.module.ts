import { Module } from '@nestjs/common';
import { CreateAuthService } from './create-auth.service';
import { CreateAuthController } from './create-auth.controller';
import { CreateAuth } from '@workspaces/domain';
import {
  CreateAuthRepositoryImpl,
  FilterByEmailOrNicknameRepositoryImpl,
  FindUserByIdRepositoryImpl,
  PrismaService,
} from '@workspaces/data-access';
import { HashGeneratorImpl } from '@workspaces/data-access';

@Module({
  controllers: [CreateAuthController],
  providers: [
    CreateAuthService,
    CreateAuth,
    {
      provide: 'FilterByEmailOrNicknameRepository',
      useClass: FilterByEmailOrNicknameRepositoryImpl,
    },
    {
      provide: 'FindUserByIdRepository',
      useClass: FindUserByIdRepositoryImpl,
    },
    {
      provide: 'CreateAuthRepository',
      useClass: CreateAuthRepositoryImpl,
    },
    {
      provide: 'HashGeneratorRepository',
      useClass: HashGeneratorImpl,
    },
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
  ],
})
export class CreateAuthModule {}
