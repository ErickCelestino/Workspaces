import { Inject } from '@nestjs/common';
import { UseCase } from '../../base/use-case';
import { UserList } from '../../entity';
import { EntityNotEmpty, EntityNotExists } from '../../error';
import { FindUserByIdRepository } from '../../repository';
import { Either, left, right } from '../../shared/either';

export class FindUserById
  implements
    UseCase<string, Either<EntityNotEmpty | EntityNotExists, UserList>>
{
  constructor(
    @Inject('FindUserByIdRepository')
    private findUserByIdRepository: FindUserByIdRepository
  ) {}
  async execute(
    input: string
  ): Promise<Either<EntityNotEmpty | EntityNotExists, UserList>> {
    const idString = 'id';
    if (Object.keys(input).length < 1) {
      return left(new EntityNotEmpty(idString));
    }

    const userFiltered = await this.findUserByIdRepository.find(input);

    if (Object.keys(userFiltered).length < 1) {
      return left(new EntityNotExists(idString));
    }

    return right(userFiltered);
  }
}
