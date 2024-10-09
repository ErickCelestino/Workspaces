import { Inject } from '@nestjs/common';
import { UseCase } from '../../base/use-case';
import { EditProfileDto } from '../../dto';
import { EntityNotComplete, EntityNotEmpty, EntityNotValid } from '../../error';
import {
  EditProfileRepository,
  FindUserByIdRepository,
} from '../../repository';
import { Either, left, right } from '../../shared/either';
import { ValidationUserId } from '../../utils';

export class EditProfile
  implements UseCase<EditProfileDto, Either<EntityNotEmpty, string>>
{
  constructor(
    @Inject('FindUserByIdRepository')
    private findUserByIdRepository: FindUserByIdRepository,
    @Inject('EditProfileRepository')
    private editProfileRepository: EditProfileRepository
  ) {}
  async execute(
    input: EditProfileDto
  ): Promise<Either<EntityNotEmpty, string>> {
    const {
      body: { name, nickname },
      userId,
      loggedUserId,
    } = input;

    if (Object.keys(name).length < 1) {
      return left(new EntityNotEmpty('Name'));
    }

    if (Object.keys(nickname).length < 1) {
      return left(new EntityNotEmpty('Nickname'));
    }

    if (loggedUserId !== userId) {
      return left(new EntityNotValid('User'));
    }

    const loggedUserValidation = await ValidationUserId(
      loggedUserId,
      this.findUserByIdRepository
    );

    if (loggedUserValidation.isLeft()) {
      return left(loggedUserValidation.value);
    }

    const UserValidation = await ValidationUserId(
      userId,
      this.findUserByIdRepository
    );

    if (UserValidation.isLeft()) {
      return left(UserValidation.value);
    }

    const editedProfile = await this.editProfileRepository.edit(input);

    if (Object.keys(editedProfile).length < 1) {
      return left(new EntityNotComplete('Edit Profile'));
    }

    return right(editedProfile);
  }
}
