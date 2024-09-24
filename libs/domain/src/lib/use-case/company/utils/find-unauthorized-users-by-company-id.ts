import { Inject } from '@nestjs/common';
import { UseCase } from '../../../base/use-case';
import { FindUnauthorizedUsersByCompanyIdDto } from '../../../dto';
import { UserList } from '../../../entity';
import {
  EntityIsNotEmpty,
  EntityNotEmpty,
  EntityNotFound,
} from '../../../error';
import { Either, left, right } from '../../../shared/either';
import {
  FindCompanyByIdRepository,
  FindUnauthorizedUsersByCompanyIdRepository,
  FindUserByIdRepository,
} from '../../../repository';
import { ValidationCompanyId, ValidationUserId } from '../../../utils';

export class FindUnauthorizedUsersByCompanyId
  implements
    UseCase<
      FindUnauthorizedUsersByCompanyIdDto,
      Either<EntityIsNotEmpty, UserList[]>
    >
{
  constructor(
    @Inject('FindUserByIdRepository')
    private findUserByIdRepository: FindUserByIdRepository,
    @Inject('FindCompanyByIdRepository')
    private findCompanyByIdRepository: FindCompanyByIdRepository,
    @Inject('FindUnauthorizedUsersByCompanyIdRepository')
    private findUnauthorizedUsersByCompanyIdRepository: FindUnauthorizedUsersByCompanyIdRepository
  ) {}

  async execute(
    input: FindUnauthorizedUsersByCompanyIdDto
  ): Promise<Either<EntityNotEmpty, UserList[]>> {
    const { companyId, loggedUserId } = input;

    if (Object.keys(loggedUserId).length < 1) {
      return left(new EntityNotEmpty('Logged User ID'));
    }

    if (Object.keys(companyId).length < 1) {
      return left(new EntityNotEmpty('Company ID'));
    }

    const userValidation = await ValidationUserId(
      loggedUserId,
      this.findUserByIdRepository
    );

    if (userValidation.isLeft()) {
      return left(userValidation.value);
    }

    const companyValidation = await ValidationCompanyId(
      companyId,
      this.findCompanyByIdRepository
    );

    if (companyValidation.isLeft()) {
      return left(companyValidation.value);
    }

    const userList = await this.findUnauthorizedUsersByCompanyIdRepository.find(
      input
    );

    return right(userList);
  }
}
