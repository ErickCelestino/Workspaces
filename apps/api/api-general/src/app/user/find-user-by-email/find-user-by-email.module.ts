import { Module } from '@nestjs/common';
import { FindUserByEmailService } from './find-user-by-email.service';
import { FindUserByEmailController } from './find-user-by-email.controller';
import {
  FindUserByEmailRepositoryImpl,
  PrismaService,
} from '@workspaces/data-access';
import { FindUserByEmail } from '@workspaces/domain';

@Module({
  controllers: [FindUserByEmailController],
  providers: [
    FindUserByEmailService,
    FindUserByEmail,
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'FindUserByEmailRepository',
      useClass: FindUserByEmailRepositoryImpl,
    },
  ],
})
export class FindUserByEmailModule {}
