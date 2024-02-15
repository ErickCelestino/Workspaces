import { Module } from '@nestjs/common';
import { CreateAuthService } from './create-auth.service';
import { CreateAuthController } from './create-auth.controller';
import { PrismaService } from '../../prisma.service';
import { CreateAuth } from '@workspaces/domain';
import {
  CreateAuthRepositoryImpl,
  FilterByEmailOrNicknameRepositoryImpl,
  FindUserByIdRepositoryImpl,
} from '@workspaces/data-access';
import { HashGeneratorImpl } from '@workspaces/utils-core';

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
      provide: 'HashGenerator',
      useClass: HashGeneratorImpl,
    },
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
  ],
})
export class CreateAuthModule {}
