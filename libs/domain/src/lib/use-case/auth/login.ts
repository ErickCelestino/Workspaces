import { Inject } from '@nestjs/common';
import { UseCase } from '../../base/use-case';
import { LoginDto, SignInDto } from '../../dto';
import {
  EntityNotEmpty,
  EntityNotExists,
  IncorrectPassword,
} from '../../error';
import {
  FilterByEmailOrNicknameRepository,
  SignInRepository,
} from '../../repository';
import { Either, left, right } from '../../shared/either';
import { AccessToken } from '../../entity';

export class Login
  implements
    UseCase<
      LoginDto,
      Either<EntityNotEmpty | IncorrectPassword | EntityNotExists, AccessToken>
    >
{
  constructor(
    @Inject('SignInRepository')
    private signInRepository: SignInRepository,
    @Inject('FilterByEmailOrNicknameRepository')
    private filterEmailRepository: FilterByEmailOrNicknameRepository
  ) {}

  async execute(
    input: LoginDto
  ): Promise<
    Either<EntityNotEmpty | IncorrectPassword | EntityNotExists, AccessToken>
  > {
    const { email, error } = input;
    if (Object.keys(error).length > 0) {
      return left(new IncorrectPassword());
    }

    if (Object.keys(email).length < 1) {
      return left(new EntityNotEmpty('email'));
    }

    const filteredUserEmail = await this.filterEmailRepository.filter(email);

    if (Object.keys(filteredUserEmail).length < 1) {
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
