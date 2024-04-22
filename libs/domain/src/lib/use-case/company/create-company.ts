import { UseCase } from '../../base/use-case';
import { CreateCompanyDto } from '../../dto';
import {
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
    private validateCnpj: ValidateCNPJRepository
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

    const validateCnpj = await this.validateCnpj.validate(cnpjString);

    if (validateCnpj == false) {
      return left(new EntityIsInvalid(cnpj));
    }

    const filterResult = await this.filterCompanyByCnpj.filter(cnpj);

    if (filterResult !== undefined) {
      return left(new EntityAlreadyExists(name));
    }

    await this.createCompany.create(input);

    return right(undefined);
  }
}
