import { CreateCompanyDto, CreateCompanyRepository } from '../../../src';
import { CompanyMock } from '../../entity/company/company.mock';

export class CreateCompanyRepositoryMock implements CreateCompanyRepository {
  inputMock = {} as CreateCompanyDto;
  async create(input: CreateCompanyDto): Promise<string> {
    this.inputMock = input;
    return CompanyMock.id;
  }
}
