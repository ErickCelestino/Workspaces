import { Inject } from '@nestjs/common';
import { UseCase } from '../../../base/use-case';
import {
  ListPlaylistCategoryDto,
  ListPlaylistCategoryReponseDto,
} from '../../../dto';
import { EntityNotEmpty, EntityNotExists } from '../../../error';
import { Either, left, right } from '../../../shared/either';
import {
  FindCompanyByIdRepository,
  FindUserByIdRepository,
  ListPlaylistCategoryRepository,
} from '../../../repository';
import {
  ValidationCompanyId,
  ValidationTextField,
  ValidationUserId,
} from '../../../utils';

export class ListPlaylistCategory
  implements
    UseCase<
      ListPlaylistCategoryDto,
      Either<EntityNotEmpty | EntityNotExists, ListPlaylistCategoryReponseDto>
    >
{
  constructor(
    @Inject('FindUserByIdRepository')
    private findUserByIdRepository: FindUserByIdRepository,
    @Inject('FindCompanyByIdRepository')
    private findCompanyByIdRepository: FindCompanyByIdRepository,
    @Inject('ListPlaylistCategoryRepository')
    private listPlaylistCategoryRepository: ListPlaylistCategoryRepository
  ) {}

  async execute(
    input: ListPlaylistCategoryDto
  ): Promise<
    Either<EntityNotEmpty | EntityNotExists, ListPlaylistCategoryReponseDto>
  > {
    const { loggedUserId, companyId } = input;

    const loggedUserIdValidation = await ValidationTextField(
      loggedUserId,
      'Logged User ID'
    );
    if (loggedUserIdValidation.isLeft())
      return left(loggedUserIdValidation.value);

    const companyIdValidation = await ValidationTextField(
      companyId,
      'Company ID'
    );
    if (companyIdValidation.isLeft()) return left(companyIdValidation.value);

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

    const listCategory = await this.listPlaylistCategoryRepository.list(input);

    return right(listCategory);
  }
}
