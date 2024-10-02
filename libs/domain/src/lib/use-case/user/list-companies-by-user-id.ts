import { Inject } from '@nestjs/common';
import { UseCase } from '../../base/use-case';
import { ListCompaniesByUserIdDto, ListCompanyResponseDto } from '../../dto';
import { EntityIsNotEmpty, EntityNotExists } from '../../error';
import { Either, left, right } from '../../shared/either';
import {
  FindCompanyByIdRepository,
  FindUserByIdRepository,
  FindUserIdByCompanyIdRepository,
  ListCompaniesByUserIdRepository,
  VerifyUserPermissionsByIdRepository,
} from '../../repository';
import {
  ValidationCompanyId,
  ValidationUserId,
  ValidationUserPermisssions,
} from '../../utils';

export class ListCompaniesByUserId
  implements
    UseCase<
      ListCompaniesByUserIdDto,
      Either<EntityIsNotEmpty, ListCompanyResponseDto>
    >
{
  constructor(
    @Inject('FindUserByIdRepository')
    private findUserByIdRepository: FindUserByIdRepository,
    @Inject('FindCompanyByIdRepository')
    private findCompanyByIdRepository: FindCompanyByIdRepository,
    @Inject('FindUserIdByCompanyIdRepository')
    private findUserIdByCompanyIdRepository: FindUserIdByCompanyIdRepository,
    @Inject('VerifyUserPermissionsByIdRepository')
    private verifyUserPermissionsByIdRepository: VerifyUserPermissionsByIdRepository,
    @Inject('ListCompaniesByUserIdRepository')
    private listCompaniesByUserIdRepository: ListCompaniesByUserIdRepository
  ) {}
  async execute(
    input: ListCompaniesByUserIdDto
  ): Promise<Either<EntityIsNotEmpty, ListCompanyResponseDto>> {
    const { companyId, loggedUserId, userId } = input;

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

    const companyValidation = await ValidationCompanyId(
      companyId,
      this.findCompanyByIdRepository
    );

    if (companyValidation.isLeft()) {
      return left(companyValidation.value);
    }

    const userAndCompanyFiltered =
      await this.findUserIdByCompanyIdRepository.find({
        companyId,
        userId: userId,
      });

    if (Object.keys(userAndCompanyFiltered).length < 1) {
      return left(new EntityNotExists('User in Company'));
    }

    const permissionValidation = await ValidationUserPermisssions(
      loggedUserId,
      ['ADMIN', 'DEFAULT_ADMIN'],
      this.verifyUserPermissionsByIdRepository
    );

    if (permissionValidation.isLeft()) {
      return left(permissionValidation.value);
    }

    const listCompaniesByUser = await this.listCompaniesByUserIdRepository.list(
      input
    );

    return right(listCompaniesByUser);
  }
}
