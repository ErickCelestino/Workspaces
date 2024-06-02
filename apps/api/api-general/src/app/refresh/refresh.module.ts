import { Module } from '@nestjs/common';
import { refreshController } from './refresh.comtroller';
import { RefreshService } from './refresh.service';
import { Refresh } from '@workspaces/domain';
import {
  JwtRefreshStrategy,
  SignInRepositoryImpl,
} from '@workspaces/data-access';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [refreshController],
  providers: [
    RefreshService,
    Refresh,
    JwtRefreshStrategy,
    {
      provide: 'SignInRepository',
      useClass: SignInRepositoryImpl,
    },
    {
      provide: 'JwtService',
      useClass: JwtService,
    },
  ],
})
export class RefreshModule {}
