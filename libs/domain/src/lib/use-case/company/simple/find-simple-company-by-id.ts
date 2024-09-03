import { Inject } from '@nestjs/common';
import { UseCase } from '../../../base/use-case';
import { CompanySimpleResponseDto, FindSimpleCompanyDto } from '../../../dto';
import { EntityNotEmpty, EntityNotExists } from '../../../error';
import { Either, left, right } from '../../../shared/either';
import {
  FindSimpleCompanyByIdRepository,
  FindUserByIdRepository,
} from '../../../repository';
import { ValidationUserId } from '../../../utils';

export class FindSimpleCompanyById
  implements
    UseCase<
      FindSimpleCompanyDto,
      Either<EntityNotEmpty, CompanySimpleResponseDto>
    >
{
  constructor(
    @Inject('FindUserByIdRepository')
    private findUserByIdRepository: FindUserByIdRepository,
    @Inject('FindCompanyByIdRepository')
    private findSimpleCompanyByIdRepository: FindSimpleCompanyByIdRepository
  ) {}
  async execute(
    input: FindSimpleCompanyDto
  ): Promise<Either<EntityNotEmpty, CompanySimpleResponseDto>> {
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

    const filteredCompany = await this.findSimpleCompanyByIdRepository.find(
      input
    );

    if (Object.keys(filteredCompany).length < 1) {
      return left(new EntityNotExists('Company'));
    }

    return right(filteredCompany);
  }
}
