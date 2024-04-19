import { CreateCompanyDto, CreateCompanyRepository } from '../../../src';

export class CreateCompanyRepositoryMock implements CreateCompanyRepository {
  createCompany = {} as CreateCompanyDto;
  async create(input: CreateCompanyDto): Promise<void> {
    this.createCompany = input;
  }
}
