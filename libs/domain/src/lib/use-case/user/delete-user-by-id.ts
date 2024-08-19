import { Inject } from '@nestjs/common';
import { UseCase } from '../../base/use-case';
import { DeleteUserByIdDto } from '../../dto';
import {
  EntityNotEmpty,
  EntityNotExists,
  NotPermissionError,
} from '../../error';
import {
  DeleteUserByIdRepository,
  FindUserByIdRepository,
  VerifyUserPermissionsByIdRepository,
} from '../../repository';
import { Either, left, right } from '../../shared/either';
import { ValidationUserId, ValidationUserPermisssions } from '../../utils';

export class DeleteUserById
  implements
    UseCase<
      DeleteUserByIdDto,
      Either<EntityNotEmpty | EntityNotExists | NotPermissionError, void>
    >
{
  constructor(
    @Inject('DeleteUserByIdRepository')
    private deleteUserByIdRepository: DeleteUserByIdRepository,
    @Inject('FindUserByIdRepository')
    private findUserByIdRepository: FindUserByIdRepository,
    @Inject('VerifyUserPermissionsByIdRepository')
    private verifyUserPermissionsByIdRepository: VerifyUserPermissionsByIdRepository
  ) {}
  async execute(
    input: DeleteUserByIdDto
  ): Promise<
    Either<EntityNotEmpty | EntityNotExists | NotPermissionError, void>
  > {
    const { id, loggedUser, description } = input;
    const idString = 'id';
    const loggedUserString = 'Usuário';

    if (Object.keys(id).length < 1) {
      return left(new EntityNotEmpty(idString));
    }

    if (Object.keys(loggedUser).length < 1) {
      return left(new EntityNotEmpty(loggedUserString));
    }

    if (Object.keys(description).length < 1) {
      return left(new EntityNotEmpty('descrição'));
    }

    const findedLoggedUser = await this.findUserByIdRepository.find(loggedUser);

    if (Object.keys(findedLoggedUser).length < 1) {
      return left(new EntityNotExists(loggedUserString));
    }

    const permissionValidation = await ValidationUserPermisssions(
      loggedUser,
      ['ADMIN', 'DEFAULT_ADMIN'],
      this.verifyUserPermissionsByIdRepository
    );

    if (permissionValidation.isLeft()) {
      return left(permissionValidation.value);
    }

    const userValidation = await ValidationUserId(
      loggedUser,
      this.findUserByIdRepository
    );

    if (userValidation.isLeft()) {
      return left(userValidation.value);
    }

    await this.deleteUserByIdRepository.delete(input);

    return right(undefined);
  }
}
