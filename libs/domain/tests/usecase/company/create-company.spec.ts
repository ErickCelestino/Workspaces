import {
  CreateCompany,
  CreateCompanyDto,
  CreateCompanyRepository,
  EntityAlreadyExists,
  FilterCompanyByCnpjRepository,
  InsufficientCharacters,
} from '../../../src';
import { companyMock } from '../../entity';
import {
  CreateCompanyRepositoryMock,
  FilterCompanyByCnpjRepositoryMock,
} from '../../repository';

interface SutTypes {
  sut: CreateCompany;
  createCompanyDto: CreateCompanyDto;
  createCompanyRepository: CreateCompanyRepository;
  filterCompanyByCnpjRepository: FilterCompanyByCnpjRepository;
}

const makeSut = (): SutTypes => {
  const createCompanyRepository = new CreateCompanyRepositoryMock();
  const filterCompanyByCnpjRepository = new FilterCompanyByCnpjRepositoryMock();

  const createCompanyDto: CreateCompanyDto = {
    name: companyMock.name,
    cnpj: companyMock.cnpj,
  };

  const sut = new CreateCompany(
    filterCompanyByCnpjRepository,
    createCompanyRepository
  );

  return {
    createCompanyRepository,
    filterCompanyByCnpjRepository,
    createCompanyDto,
    sut,
  };
};

describe('CreateCompany', () => {
  it('should return void when a correct company is created', async () => {
    const { createCompanyDto, sut } = makeSut();

    const result = await sut.execute(createCompanyDto);
    console.log(result.value);

    expect(result.isLeft()).toBe(false);
    expect(result.isRight()).toBe(true);
    expect(result.value).toBe(undefined);
  });

  it('should return InsufficientCharacters when a incorrect name', async () => {
    const { sut } = makeSut();

    const createUserDto: CreateCompanyDto = {
      name: '',
      cnpj: companyMock.cnpj,
    };

    const result = await sut.execute(createUserDto);

    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(InsufficientCharacters);
  });

  it('should return InsufficientCharacters when a incorrect cnpj', async () => {
    const { sut } = makeSut();

    const createUserDto: CreateCompanyDto = {
      name: companyMock.name,
      cnpj: '',
    };

    const result = await sut.execute(createUserDto);

    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(InsufficientCharacters);
  });

  it('should return EntityAlreadyExists if exists company in system', async () => {
    const { createCompanyDto, createCompanyRepository } = makeSut();

    const mockInvalidRepository: FilterCompanyByCnpjRepository = {
      filter: jest.fn(async () => companyMock),
    };

    const sut = new CreateCompany(
      mockInvalidRepository,
      createCompanyRepository
    );

    const result = await sut.execute(createCompanyDto);

    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityAlreadyExists);
  });
});
