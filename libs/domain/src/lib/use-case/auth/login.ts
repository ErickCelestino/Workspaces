import { Inject } from '@nestjs/common';
import { UseCase } from '../../base/use-case';
import { ValidateHashDto, LoginDto, SignInDto } from '../../dto';
import {
  EntityNotExists,
  IncorrectPassword,
  InsufficientCharacters,
} from '../../error';
import {
  FilterByEmailOrNicknameRepository,
  ValidateHashRepository,
  SignInRepository,
} from '../../repository';
import { Either, left, right } from '../../shared/either';
import { Auth } from '../../entity';

export class login
  implements
    UseCase<LoginDto, Either<InsufficientCharacters | EntityNotExists, string>>
{
  constructor(
    @Inject('FilterByEmailOrNicknameRepository')
    private filterEmail: FilterByEmailOrNicknameRepository,
    @Inject('CompareHashRepository')
    private validateHashRespository: ValidateHashRepository,
    @Inject('CompareHashRepository')
    private signInRepository: SignInRepository
  ) {}

  async execute(
    input: LoginDto
  ): Promise<Either<InsufficientCharacters | EntityNotExists, string>> {
    const { email, password } = input;

    if (email.length < 1) {
      return left(new InsufficientCharacters('Email'));
    }

    if (password.length < 1) {
      return left(new InsufficientCharacters('Password'));
    }

    const filteredUserEmail = await this.filterEmail.filter(email);

    if (filteredUserEmail.userId.length < 1) {
      return left(new EntityNotExists('User'));
    }

    const filteredAuth: Auth[] = filteredUserEmail.auth.map((auth) => {
      if (auth.status != 'DEFAULT') {
        return {
          authId: '',
          userId: '',
          email: '',
          status: '',
          password: '',
        };
      }
      return auth;
    });

    if (filteredAuth[0].authId.length < 1) {
      return left(new EntityNotExists('Auth'));
    }

    const hashPassword =
      filteredAuth[0].password == null ? '' : filteredAuth[0].password;

    const validateDto: ValidateHashDto = {
      hash: hashPassword,
      key: password,
    };

    const validateResult = await this.validateHashRespository.validate(
      validateDto
    );

    if (!validateResult) {
      left(new IncorrectPassword());
    }

    const signInDto: SignInDto = {
      email: email,
      user_id: filteredUserEmail.userId,
    };

    const signInResult = await this.signInRepository.sign(signInDto);

    return right(signInResult);
  }
}
