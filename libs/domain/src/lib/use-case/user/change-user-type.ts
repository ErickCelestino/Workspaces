import { Inject } from '@nestjs/common';
import { UseCase } from '../../base/use-case';
import { ChangeUserTypeDto } from '../../dto';
import { EntityNotComplete, EntityNotEmpty } from '../../error';
import { Either, left, right } from '../../shared/either';
import { ValidationUserId, ValidationUserPermisssions } from '../../utils';
import {
  ChangeUserTypeRepository,
  FindUserByIdRepository,
  VerifyUserPermissionsByIdRepository,
} from '../../repository';

export class ChangeUserType
  implements UseCase<ChangeUserTypeDto, Either<EntityNotEmpty, string>>
{
  constructor(
    @Inject('FindUserByIdRepository')
    private findUserByIdRepository: FindUserByIdRepository,
    @Inject('VerifyUserPermissionsByIdRepository')
    private verifyUserPermissionsByIdRepository: VerifyUserPermissionsByIdRepository,
    @Inject('ChangeUserTypeRepository')
    private changeUserTypeRepository: ChangeUserTypeRepository
  ) {}
  async execute(
    input: ChangeUserTypeDto
  ): Promise<Either<EntityNotEmpty, string>> {
    const { loggedUserId, type, userId } = input;

    if (Object.keys(type).length < 1) {
      return left(new EntityNotEmpty('type'));
    }

    const loggedUserValidation = await ValidationUserId(
      loggedUserId,
      this.findUserByIdRepository
    );

    if (loggedUserValidation.isLeft()) {
      return left(loggedUserValidation.value);
    }

    const userValidation = await ValidationUserId(
      userId,
      this.findUserByIdRepository
    );

    if (userValidation.isLeft()) {
      return left(userValidation.value);
    }

    if (type === 'ADMIN') {
      const permissionValidation = await ValidationUserPermisssions(
        loggedUserId,
        ['ADMIN'],
        this.verifyUserPermissionsByIdRepository
      );

      if (permissionValidation.isLeft()) {
        return left(permissionValidation.value);
      }
    } else {
      const permissionValidation = await ValidationUserPermisssions(
        loggedUserId,
        ['ADMIN', 'DEFAULT_ADMIN'],
        this.verifyUserPermissionsByIdRepository
      );

      if (permissionValidation.isLeft()) {
        return left(permissionValidation.value);
      }
    }

    const changedUser = await this.changeUserTypeRepository.change(input);

    if (Object.keys(changedUser).length < 1) {
      return left(new EntityNotComplete('Change User'));
    }

    return right(changedUser);
  }
}
