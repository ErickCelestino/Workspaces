import { Inject } from '@nestjs/common';
import { UseCase } from '../../../base/use-case';
import { RemoveUserAccessToTheCompanyDto } from '../../../dto';
import {
  EntityNotComplete,
  EntityNotEmpty,
  EntityNotExists,
} from '../../../error';
import { Either, left, right } from '../../../shared/either';
import {
  FindCompanyByIdRepository,
  FindUserByIdRepository,
  FindUserIdByCompanyIdRepository,
  RemoveUserAccessToTheCompanyRepository,
  VerifyUserPermissionsByIdRepository,
} from '../../../repository';
import {
  ValidationCompanyId,
  ValidationUserId,
  ValidationUserPermisssions,
} from '../../../utils';

export class RemoveUserAccessToTheCompany
  implements
    UseCase<RemoveUserAccessToTheCompanyDto, Either<EntityNotEmpty, string>>
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
    @Inject('RemoveUserAccessToTheCompanyRepository')
    private removeUserAccessToTheCompanyRepository: RemoveUserAccessToTheCompanyRepository
  ) {}
  async execute(
    input: RemoveUserAccessToTheCompanyDto
  ): Promise<Either<EntityNotEmpty, string>> {
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

    const removedUserAccess =
      await this.removeUserAccessToTheCompanyRepository.remove(input);

    if (Object.keys(removedUserAccess).length < 1) {
      return left(new EntityNotComplete('Remove User Access'));
    }

    return right(removedUserAccess);
  }
}
