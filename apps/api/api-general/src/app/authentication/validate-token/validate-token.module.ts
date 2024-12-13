import { Module } from '@nestjs/common';
import { ValidateTokenService } from './validate-token.service';
import { ValidateTokenController } from './validate-token.controller';
import { ValidateToken } from '@workspaces/domain';
import {
  FindUserByIdRepositoryImpl,
  PrismaGeneralService,
  ValidateTokenExpirationRepositoryImpl,
} from '@workspaces/data-access';

@Module({
  controllers: [ValidateTokenController],
  providers: [
    ValidateTokenService,
    ValidateToken,
    {
      provide: 'FindUserByIdRepository',
      useClass: FindUserByIdRepositoryImpl,
    },
    {
      provide: 'ValidateTokenExpirationRepository',
      useClass: ValidateTokenExpirationRepositoryImpl,
    },
    {
      provide: 'PrismaService',
      useClass: PrismaGeneralService,
    },
  ],
})
export class ValidateTokenModule {}
