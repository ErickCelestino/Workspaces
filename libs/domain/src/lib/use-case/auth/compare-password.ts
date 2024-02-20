import { UseCase } from '../../base/use-case';
import { CompareHashDto, ComparePasswordDto } from '../../dto';
import { Auth } from '../../entity';
import { EntityNotExists, InsufficientCharacters } from '../../error';
import {
  CompareHashRepository,
  FindUserByIdRepository,
} from '../../repository';
import { Either, left, right } from '../../shared/either';
import { Inject } from '@nestjs/common';

export class ComparePassword
  implements
    UseCase<
      ComparePasswordDto,
      Either<EntityNotExists | InsufficientCharacters, string>
    >
{
  constructor(
    @Inject('CompareHashRepository')
    private compareHashRespository: CompareHashRepository,
    @Inject('FindUserByIdRepository')
    private findUserByIdRepository: FindUserByIdRepository
  ) {}

  async execute(
    input: ComparePasswordDto
  ): Promise<Either<EntityNotExists | InsufficientCharacters, string>> {
    const { userId, possiblePassword } = input;
    const userString = 'User';

    if (userId.length < 1) {
      return left(new EntityNotExists(userString));
    }

    if (possiblePassword.length < 3) {
      return left(new InsufficientCharacters('password'));
    }

    const findedUser = await this.findUserByIdRepository.find(userId);

    if (findedUser.userId.length < 1) {
      return left(new EntityNotExists(userString));
    }

    const filteredAuth: Auth[] = findedUser.auth.map((auth) => {
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

    const password =
      filteredAuth[0].password == null ? '' : filteredAuth[0].password;

    const compareDto: CompareHashDto = {
      hash: password,
      key: possiblePassword,
    };

    const copareResult = await this.compareHashRespository.compare(compareDto);

    console.log(copareResult);

    return right('');
  }
}
