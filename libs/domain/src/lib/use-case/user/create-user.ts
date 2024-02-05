import { UseCase } from '../../base/use-case';
import { CreateUserDto } from '../../dtos';
import { InsufficientCharacters } from '../../errors';
import { Either, left, right } from '../../shared/either';

export class CreateUser
  implements UseCase<CreateUserDto, Either<InsufficientCharacters, void>>
{
  async execute(
    input: CreateUserDto
  ): Promise<Either<InsufficientCharacters, void>> {
    const { name, nickName } = input;

    if (name.length < 3) {
      return left(new InsufficientCharacters('name'));
    }

    if (nickName.length < 3) {
      return left(new InsufficientCharacters('nickName'));
    }

    return right(undefined);
  }
}
