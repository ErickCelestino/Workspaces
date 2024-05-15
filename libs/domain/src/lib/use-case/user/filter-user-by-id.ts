import { UseCase } from '../../base/use-case';
import { UserList } from '../../entity';
import { EntityNotEmpty, EntityNotExists } from '../../error';
import { FindUserByIdRepository } from '../../repository';
import { Either, left, right } from '../../shared/either';

export class FilterUserById
  implements
    UseCase<string, Either<EntityNotEmpty | EntityNotExists, UserList>>
{
  constructor(private filterUserById: FindUserByIdRepository) {}
  async execute(
    input: string
  ): Promise<Either<EntityNotEmpty | EntityNotExists, UserList>> {
    const idString = 'id';
    if (input.length < 0) {
      left(new EntityNotEmpty(idString));
    }

    const userFiltered = await this.filterUserById.find(input);

    if (Object.keys(userFiltered).length < 1) {
      left(new EntityNotExists(idString));
    }

    return right(userFiltered);
  }
}
