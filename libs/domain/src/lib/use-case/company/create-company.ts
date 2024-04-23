import { UseCase } from '../../base/use-case';
import { CreateCompanyAddressDto, CreateCompanyDto } from '../../dto';
import {
  ConsultCNPJRepository,
  CreateCompanyRepository,
  FilterCompanyByCnpjRepository,
  ValidateCNPJRepository,
  CreateCompanyAddressRepository,
  FilterCityByNameRepository,
} from '../../repository';
import {
  EntityAlreadyExists,
  EntityIsInvalid,
  EntityNotExists,
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
    private consultCnpj: ConsultCNPJRepository,
    @Inject('CreateCompanyAddressRepository')
    private createCompanyAddress: CreateCompanyAddressRepository,
    @Inject('FilterCityByNameRepository')
    private filterCityByName: FilterCityByNameRepository
  ) {}

  async execute(
    input: CreateCompanyDto
  ): Promise<Either<InsufficientCharacters | EntityAlreadyExists, void>> {
    const { fantasy_name, cnpj } = input;
    const cnpjString = 'cnpj';

    if (fantasy_name.length < 3) {
      return left(new InsufficientCharacters('fantasy name'));
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
      return left(new EntityAlreadyExists(fantasy_name));
    }

    const consultCnpjResult = await this.consultCnpj.consult(cnpj);

    if (Object.keys(consultCnpjResult).length < 1) {
      return left(new EntityIsInvalid(cnpjString));
    }

    const cityResult = await this.filterCityByName.filter(
      consultCnpjResult.city
    );

    if (Object.keys(cityResult).length < 1) {
      return left(new EntityNotExists('city'));
    }
    const companyId = await this.createCompany.create(input, consultCnpjResult);

    const dto: CreateCompanyAddressDto = {
      address: {
        city_id: cityResult.city_id,
        district: consultCnpjResult.district,
        number: consultCnpjResult.number,
        street: consultCnpjResult.street,
        zipcode: consultCnpjResult.zipcode,
      },
      company_id: companyId,
    };

    await this.createCompanyAddress.create(dto);

    return right(undefined);
  }
}
