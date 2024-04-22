import { UseCase } from '../../base/use-case';
import { CreateCompanyDto } from '../../dto';
import {
  ConsultCNPJRepository,
  CreateCompanyRepository,
  FilterCompanyByCnpjRepository,
  ValidateCNPJRepository,
} from '../../repository';
import {
  EntityAlreadyExists,
  EntityIsInvalid,
  InsufficientCharacters,
} from '../../error';
import { Either, left, right } from '../../shared/either';
import { Inject } from '@nestjs/common';

export class CreateCompany
  implements
    UseCase<
      CreateCompanyDto,
      Either<InsufficientCharacters | EntityAlreadyExists, void>
    >
{
  constructor(
    @Inject('FilterCompanyByCnpjRepository')
    private filterCompanyByCnpj: FilterCompanyByCnpjRepository,
    @Inject('CreateCompanyRepository')
    private createCompany: CreateCompanyRepository,
    @Inject('ValidateCNPJRepository')
    private validateCnpj: ValidateCNPJRepository,
    @Inject('ConsultCNPJRepository')
    private consultCnpj: ConsultCNPJRepository
  ) {}

  async execute(
    input: CreateCompanyDto
  ): Promise<Either<InsufficientCharacters | EntityAlreadyExists, void>> {
    const { name, cnpj } = input;
    const cnpjString = 'cnpj';

    if (name.length < 3) {
      return left(new InsufficientCharacters('name'));
    }
    if (cnpj.length < 14) {
      return left(new InsufficientCharacters(cnpjString));
    }

    const validateCnpj = this.validateCnpj.validate(cnpj);

    if (validateCnpj == false) {
      return left(new EntityIsInvalid(cnpjString));
    }

    const filterInDataBase = await this.filterCompanyByCnpj.filter(cnpj);

    if (filterInDataBase !== undefined) {
      return left(new EntityAlreadyExists(name));
    }

    const consultCnpjResult = await this.consultCnpj.consult(cnpj);

    if (Object.keys(consultCnpjResult).length < 1) {
      return left(new EntityIsInvalid(cnpjString));
    }

    await this.createCompany.create(input, consultCnpjResult);

    return right(undefined);
  }
}
