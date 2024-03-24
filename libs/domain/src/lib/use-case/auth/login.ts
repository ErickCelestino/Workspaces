import { Inject } from '@nestjs/common';
import { UseCase } from '../../base/use-case';
import { LoginDto, SignInDto } from '../../dto';
import { EntityNotExists, IncorrectPassword } from '../../error';
import {
  FilterByEmailOrNicknameRepository,
  SignInRepository,
} from '../../repository';
import { Either, left, right } from '../../shared/either';
import { AccessToken } from '../../entity';

export class Login
  implements UseCase<LoginDto, Either<EntityNotExists, AccessToken>>
{
  constructor(
    @Inject('SignInRepository')
    private signInRepository: SignInRepository,
    @Inject('FilterByEmailOrNicknameRepository')
    private filterEmail: FilterByEmailOrNicknameRepository
  ) {}

  async execute(
    input: LoginDto
  ): Promise<Either<EntityNotExists, AccessToken>> {
    const { email, error } = input;
    if (error.length > 0) {
      return left(new IncorrectPassword());
    }

    if (email.length < 1) {
      return left(new EntityNotExists('email'));
    }

    const filteredUserEmail = await this.filterEmail.filter(email);

    if (filteredUserEmail.userId.length < 1) {
      return left(new EntityNotExists('User'));
    }

    const signInDto: SignInDto = {
      email: email,
      userId: filteredUserEmail.userId,
    };

    const signInResult = await this.signInRepository.sign(signInDto);

    return right(signInResult);
  }
}
