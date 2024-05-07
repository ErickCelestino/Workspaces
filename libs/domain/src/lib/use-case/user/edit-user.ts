import { UseCase } from '../../base/use-case';
import { EditUserDto } from '../../dto';
import { EntityNotExists, InsufficientCharacters } from '../../error';
import { EditUserRepository } from '../../repository';
import { Either, left, right } from '../../shared/either';

export class EditUser
  implements
    UseCase<
      EditUserDto,
      Either<InsufficientCharacters | EntityNotExists, void>
    >
{
  constructor(private editUserRepository: EditUserRepository) {}
  async execute(
    input: EditUserDto
  ): Promise<Either<InsufficientCharacters | EntityNotExists, void>> {
    const { id, name } = input;

    if (id.length < 1) {
      return left(new EntityNotExists('id'));
    }

    if (name.length < 3) {
      return left(new InsufficientCharacters('name'));
    }

    await this.editUserRepository.edit(input);

    return right(undefined);
  }
}
