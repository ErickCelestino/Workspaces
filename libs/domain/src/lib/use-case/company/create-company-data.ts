import { Inject } from '@nestjs/common';
import { UseCase } from '../../base/use-case';
import { CreateCompanyDataDto } from '../../dto';
import { EntityNotEmpty } from '../../error';
import { FindUserByIdRepository } from '../../repository';
import { Either, left, right } from '../../shared/either';
import { ValidationUserId } from '../../utils';

export class CreateCompanyData
  implements UseCase<CreateCompanyDataDto, Either<EntityNotEmpty, string>>
{
  constructor(
    @Inject('FindUserByIdRepository')
    private findUserByIdRepository: FindUserByIdRepository
  ) {}
  async execute(
    input: CreateCompanyDataDto
  ): Promise<Either<EntityNotEmpty, string>> {
    const {
      body: { legalNature, opening, phone, port, situation },
      companyId,
      loggedUserId,
    } = input;

    if (Object.keys(loggedUserId).length < 1) {
      return left(new EntityNotEmpty('Logged User ID'));
    }

    if (Object.keys(companyId).length < 1) {
      return left(new EntityNotEmpty('Company ID'));
    }

    if (Object.keys(legalNature).length < 1) {
      return left(new EntityNotEmpty('Legal Nature'));
    }

    if (Object.keys(opening).length < 1) {
      return left(new EntityNotEmpty('Opening'));
    }

    if (Object.keys(phone).length < 1) {
      return left(new EntityNotEmpty('Phone'));
    }

    if (Object.keys(port).length < 1) {
      return left(new EntityNotEmpty('Port'));
    }

    if (Object.keys(situation).length < 1) {
      return left(new EntityNotEmpty('Situation'));
    }

    const userValidation = await ValidationUserId(
      loggedUserId,
      this.findUserByIdRepository
    );

    if (userValidation.isLeft()) {
      return left(userValidation.value);
    }

    return right('');
  }
}
