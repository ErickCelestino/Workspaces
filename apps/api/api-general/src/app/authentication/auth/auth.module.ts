import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Login, ValidateUser } from '@workspaces/domain';
import {
  FilterByEmailOrNicknameRepositoryImpl,
  SignInRepositoryImpl,
  ValidateHashRepositoryImpl,
  LocalAuthGuard,
  LocalStrategy,
  JwtStrategy,
  PrismaService,
} from '@workspaces/data-access';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env['JWT_SECRET'],
      signOptions: { expiresIn: '2h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    ValidateUser,
    LocalAuthGuard,
    LocalStrategy,
    JwtStrategy,
    Login,
    {
      provide: 'SignInRepository',
      useClass: SignInRepositoryImpl,
    },
    {
      provide: 'ValidateHashRepository',
      useClass: ValidateHashRepositoryImpl,
    },
    {
      provide: 'FilterByEmailOrNicknameRepository',
      useClass: FilterByEmailOrNicknameRepositoryImpl,
    },
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'JwtService',
      useClass: JwtService,
    },
  ],
})
export class AuthModule {}
