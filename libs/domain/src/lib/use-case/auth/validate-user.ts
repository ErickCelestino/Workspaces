import { Inject } from '@nestjs/common';
import { UseCase } from '../../base/use-case';
import { ValidateHashDto, LoginDto, ValidateUserDto } from '../../dto';
import {
  EntityNotExists,
  IncorrectPassword,
  InsufficientCharacters,
} from '../../error';
import {
  FilterByEmailOrNicknameRepository,
  ValidateHashRepository,
} from '../../repository';
import { Either, left, right } from '../../shared/either';
import { Auth } from '../../entity';

export class ValidateUser
  implements
    UseCase<
      ValidateUserDto,
      Either<InsufficientCharacters | EntityNotExists, LoginDto>
    >
{
  constructor(
    @Inject('FilterByEmailOrNicknameRepository')
    private filterEmail: FilterByEmailOrNicknameRepository,
    @Inject('ValidateHashRepository')
    private validateHashRespository: ValidateHashRepository
  ) {}

  async execute(
    input: ValidateUserDto
  ): Promise<Either<InsufficientCharacters | EntityNotExists, LoginDto>> {
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
      return left(new IncorrectPassword());
    }

    const returnDto: LoginDto = {
      email: input.email,
      error: '',
    };

    return right(returnDto);
  }
}
