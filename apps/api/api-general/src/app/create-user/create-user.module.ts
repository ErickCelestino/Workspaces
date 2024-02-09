import { Module } from '@nestjs/common';
import { CreateUserService } from './create-user.service';
import { CreateUserController } from './create-user.controller';
import { PrismaService } from '../../prisma.service';
import { CreateUserRepositoryImpl } from '@workspaces/data-access';

@Module({
  controllers: [CreateUserController],
  providers: [
    CreateUserService,
    {
      provide: 'CreateUserRepository',
      useClass: CreateUserRepositoryImpl,
    },
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
  ],
})
export class CreateUserModule {}
