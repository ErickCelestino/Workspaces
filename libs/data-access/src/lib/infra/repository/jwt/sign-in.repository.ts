import { SignInDto, SignInRepository } from '@workspaces/domain';
import { JwtService } from '@nestjs/jwt';

export class SignInRepositoryImpl implements SignInRepository {
  constructor(private jwtService: JwtService) {}

  async sign(input: SignInDto): Promise<string> {
    return this.jwtService.sign(input);
  }
}
