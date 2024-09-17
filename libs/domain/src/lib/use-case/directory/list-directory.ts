import { Inject } from '@nestjs/common';
import { UseCase } from '../../base/use-case';
import { ListDirectoryDto, ListDirectoryResponseDto } from '../../dto';
import { EntityNotEmpty, EntityNotExists } from '../../error';
import { Either, left, right } from '../../shared/either';
import {
  FindCompanyByIdRepository,
  FindUserByIdRepository,
  ListDirectoryRepository,
} from '../../repository';
import {
  ValidationCompanyId,
  ValidationTextField,
  ValidationUserId,
} from '../../utils';

export class ListDirectory
  implements
    UseCase<
      ListDirectoryDto,
      Either<EntityNotEmpty | EntityNotExists, ListDirectoryResponseDto>
    >
{
  constructor(
    @Inject('FindUserByIdRepository')
    private findUserByIdRepository: FindUserByIdRepository,
    @Inject('FindCompanyByIdRepository')
    private findCompanyByIdRepository: FindCompanyByIdRepository,
    @Inject('ListDirectoryRepository')
    private listDirectoryRepository: ListDirectoryRepository
  ) {}

  async execute(
    input: ListDirectoryDto
  ): Promise<
    Either<EntityNotEmpty | EntityNotExists, ListDirectoryResponseDto>
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

    const listDirectory = await this.listDirectoryRepository.list(input);

    return right(listDirectory);
  }
}
