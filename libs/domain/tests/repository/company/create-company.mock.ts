import { CreateCompanyDto, CreateCompanyRepository } from '../../../src';
import { companyMock } from '../../entity';

export class CreateCompanyRepositoryMock implements CreateCompanyRepository {
  createCompany = {} as CreateCompanyDto;
  async create(input: CreateCompanyDto): Promise<string> {
    this.createCompany = input;

    return companyMock.id;
  }
}
