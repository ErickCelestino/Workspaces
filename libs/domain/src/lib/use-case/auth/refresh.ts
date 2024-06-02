import { Inject } from '@nestjs/common';
import { UseCase } from '../../base/use-case';
import { RefreshDto } from '../../dto';
import { AccessToken } from '../../entity';
import { TokenExpired } from '../../error';
import { SignInRepository } from '../../repository';
import { Either, left, right } from '../../shared/either';

export class Refresh
  implements UseCase<RefreshDto, Either<TokenExpired, AccessToken>>
{
  constructor(
    @Inject('SignInRepository')
    private signInRepository: SignInRepository
  ) {}

  async execute(input: RefreshDto): Promise<Either<TokenExpired, AccessToken>> {
    const { token } = input;
    if (token.length < 1) {
      return left(new TokenExpired());
    }

    const teste: AccessToken = {
      token: 'token',
      refreshToken: 'refreshToken',
    };

    // const signInResult = await this.signInRepository.sign(signInDto);

    return right(teste);
  }
}
