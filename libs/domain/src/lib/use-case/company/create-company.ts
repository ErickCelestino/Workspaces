import { UseCase } from '../../base/use-case';
import { CreateCompanyDto } from '../../dto';
import {
  CreateCompanyRepository,
  FilterCompanyByCnpjRepository,
} from '../../repository';
import { EntityAlreadyExists, InsufficientCharacters } from '../../error';
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
    @Inject('FilterCompanyByCnpj')
    private filterCompanyByCnpj: FilterCompanyByCnpjRepository,
    @Inject('CreateCompanyRepository')
    private createCompany: CreateCompanyRepository
  ) {}

  async execute(
    input: CreateCompanyDto
  ): Promise<Either<InsufficientCharacters | EntityAlreadyExists, void>> {
    const { name, cnpj } = input;

    if (name.length < 3) {
      return left(new InsufficientCharacters('name'));
    }
    if (cnpj.length < 3) {
      return left(new InsufficientCharacters('cnpj'));
    }

    const filterResult = await this.filterCompanyByCnpj.filter(cnpj);

    if (filterResult == undefined) {
      return left(new EntityAlreadyExists(name));
    }

    await this.createCompany.create(input);

    return right(undefined);
  }
}
