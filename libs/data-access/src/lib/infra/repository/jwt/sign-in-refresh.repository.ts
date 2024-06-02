import { SignInDto, SignInRefreshRepository } from '@workspaces/domain';
import { JwtService } from '@nestjs/jwt';
import { Inject } from '@nestjs/common';

export class SignInRefreshRepositoryImpl implements SignInRefreshRepository {
  constructor(@Inject('JwtService') private jwtService: JwtService) {}

  async sign(input: SignInDto): Promise<string> {
    const payload = { email: input.email, sub: input.userId };
    const result = this.jwtService.sign(payload, {
      secret: `${process.env['JWT_SECRET']}`,
      expiresIn: '7d', // aqui ta expirando
    });
    return result;
  }
}
