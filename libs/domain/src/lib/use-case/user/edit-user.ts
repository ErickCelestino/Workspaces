import { Inject } from '@nestjs/common';
import { UseCase } from '../../base/use-case';
import { EditUserDto } from '../../dto';
import {
  EntityNotEdit,
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
      Either<InsufficientCharacters | EntityNotExists, string>
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
  ): Promise<Either<InsufficientCharacters | EntityNotExists, string>> {
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

    const editedUserId = await this.editUserRepository.edit(input);

    if (Object.keys(editedUserId).length < 1) {
      return left(new EntityNotEdit('user'));
    }

    return right(editedUserId);
  }
}
