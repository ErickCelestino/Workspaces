import { Inject } from '@nestjs/common';
import { UseCase } from '../../base/use-case';
import { CompanyDataResponseDto, ConsultCompanyByCnpjDto } from '../../dto';
import { EntityNotEmpty, EntityNotExists } from '../../error';
import { Either, left, right } from '../../shared/either';
import {
  ConsultCompanyByCnpjRepository,
  FindCompanyByCnpjRepository,
  FindUserByIdRepository,
} from '../../repository';
import { ValidationCompanyByCnpj, ValidationUserId } from '../../utils';

export class ConsultCompanyByCnpj
  implements
    UseCase<
      ConsultCompanyByCnpjDto,
      Either<EntityNotEmpty, CompanyDataResponseDto>
    >
{
  constructor(
    @Inject('FindUserByIdRepository')
    private findUserByIdRepository: FindUserByIdRepository,
    @Inject('FindCompanyByCnpjRepository')
    private findCompanyByCnpjRepository: FindCompanyByCnpjRepository,
    @Inject('ConsultCompanyByCnpjRepository')
    private consultCompanyByCnpjRepository: ConsultCompanyByCnpjRepository
  ) {}
  async execute(
    input: ConsultCompanyByCnpjDto
  ): Promise<Either<EntityNotEmpty, CompanyDataResponseDto>> {
    const { cnpj, loggedUserId } = input;
    const formatedcnpj = cnpj.replace(/[^\d]+/g, '');
    if (Object.keys(formatedcnpj).length < 1) {
      return left(new EntityNotEmpty('CNPJ'));
    }

    if (Object.keys(loggedUserId).length < 1) {
      return left(new EntityNotEmpty('Logged User ID'));
    }

    const userValidation = await ValidationUserId(
      loggedUserId,
      this.findUserByIdRepository
    );

    if (userValidation.isLeft()) {
      return left(userValidation.value);
    }

    const companyValidation = await ValidationCompanyByCnpj(
      formatedcnpj,
      this.findCompanyByCnpjRepository
    );

    if (companyValidation.isLeft()) {
      return left(companyValidation.value);
    }

    const consultedCompany = await this.consultCompanyByCnpjRepository.consult(
      formatedcnpj
    );

    if (
      Object.keys(consultedCompany?.situation ?? consultedCompany).length < 1
    ) {
      return left(new EntityNotExists('Company'));
    }

    return right(consultedCompany);
  }
}
