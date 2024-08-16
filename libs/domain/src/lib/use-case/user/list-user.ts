import { Inject } from '@nestjs/common';
import { UseCase } from '../../base/use-case';
import { Either, left, right } from '../../shared/either';
import {
  BtrinSanitizeRepository,
  FindUserByIdRepository,
  ListUserRepository,
  VerifyUserTypeByIdRepository,
} from '../../repository';
import { ListUserDto, ListUserResponseDto } from '../../dto';
import { EntityNotEmpty, NotPermissionError, SyntaxError } from '../../error';
import { ValidationUserId } from '../../utils';

export class ListUser
  implements UseCase<ListUserDto, Either<SyntaxError, ListUserResponseDto>>
{
  constructor(
    @Inject('ListUserRepository')
    private listUserRepository: ListUserRepository,
    @Inject('BtrinSanatizeRepository')
    private btrinSanitizeRepository: BtrinSanitizeRepository,
    @Inject('FindUserByIdRepository')
    private findUserByIdRepository: FindUserByIdRepository,
    @Inject('VerifyUserTypeByIdRepository')
    private verifyUserTypeByIdRepository: VerifyUserTypeByIdRepository
  ) {}

  async execute(
    input: ListUserDto
  ): Promise<Either<SyntaxError, ListUserResponseDto>> {
    const { filter, loggedUserId } = input;
    const sanitizedInput = await this.btrinSanitizeRepository.btrin(filter);
    if (sanitizedInput === undefined) {
      return left(new SyntaxError());
    }

    if (Object.keys(loggedUserId).length < 1) {
      return left(new EntityNotEmpty('User ID'));
    }

    const userValidation = await ValidationUserId(
      loggedUserId,
      this.findUserByIdRepository
    );

    if (userValidation.isLeft()) {
      return left(userValidation.value);
    }

    const userType = await this.verifyUserTypeByIdRepository.verify(
      loggedUserId
    );

    if (userType !== 'ADMIN') {
      return left(new NotPermissionError(loggedUserId));
    }

    const listUserResult = await this.listUserRepository.list(input);

    return right(listUserResult);
  }
}
