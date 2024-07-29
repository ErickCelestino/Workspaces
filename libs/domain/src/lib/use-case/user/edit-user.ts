import { Inject } from '@nestjs/common';
import { UseCase } from '../../base/use-case';
import { EditUserDto } from '../../dto';
import {
  EntityNotEmpty,
  EntityNotExists,
  InsufficientCharacters,
} from '../../error';
import { EditUserRepository, FindUserByIdRepository } from '../../repository';
import { Either, left, right } from '../../shared/either';
import { ValidationUserId } from '../../utils';

export class EditUser
  implements
    UseCase<
      EditUserDto,
      Either<InsufficientCharacters | EntityNotExists, void>
    >
{
  constructor(
    @Inject('EditUserRepository')
    private editUserRepository: EditUserRepository,
    @Inject('FindUserByIdRepository')
    private findUserByIdRepository: FindUserByIdRepository
  ) {}

  async execute(
    input: EditUserDto
  ): Promise<Either<InsufficientCharacters | EntityNotExists, void>> {
    const { id, name, status } = input;

    if (Object.keys(id).length < 1) {
      return left(new EntityNotEmpty('id'));
    }

    if (Object.keys(name).length < 3) {
      return left(new InsufficientCharacters('name'));
    }

    if (Object.keys(status).length < 1) {
      return left(new EntityNotEmpty('status'));
    }

    const userValidation = await ValidationUserId(
      id,
      this.findUserByIdRepository
    );

    if (userValidation.isLeft()) {
      return left(userValidation.value);
    }

    await this.editUserRepository.edit(input);

    return right(undefined);
  }
}
