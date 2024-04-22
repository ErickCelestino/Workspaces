import {
  CreateCompany,
  CreateCompanyDto,
  CreateCompanyRepository,
  EntityAlreadyExists,
  EntityIsInvalid,
  FilterCompanyByCnpjRepository,
  InsufficientCharacters,
  ValidateCNPJRepository,
} from '../../../src';
import { companyMock } from '../../entity';
import {
  CreateCompanyRepositoryMock,
  FilterCompanyByCnpjRepositoryMock,
} from '../../repository';
import { ValidateCNPJRepositoryMock } from '../../repository/company/validate-cnpj.mock';

interface SutTypes {
  sut: CreateCompany;
  createCompanyDto: CreateCompanyDto;
  createCompanyRepository: CreateCompanyRepository;
  filterCompanyByCnpjRepository: FilterCompanyByCnpjRepository;
  validateCnpjRepository: ValidateCNPJRepository;
}

const makeSut = (): SutTypes => {
  const createCompanyRepository = new CreateCompanyRepositoryMock();
  const filterCompanyByCnpjRepository = new FilterCompanyByCnpjRepositoryMock();
  const validateCnpjRepository = new ValidateCNPJRepositoryMock();

  const createCompanyDto: CreateCompanyDto = {
    name: companyMock.name,
    cnpj: companyMock.cnpj,
  };

  const sut = new CreateCompany(
    filterCompanyByCnpjRepository,
    createCompanyRepository,
    validateCnpjRepository
  );

  return {
    createCompanyRepository,
    filterCompanyByCnpjRepository,
    validateCnpjRepository,
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
    const {
      createCompanyDto,
      createCompanyRepository,
      validateCnpjRepository,
    } = makeSut();

    const mockInvalidRepository: FilterCompanyByCnpjRepository = {
      filter: jest.fn(async () => companyMock),
    };

    const sut = new CreateCompany(
      mockInvalidRepository,
      createCompanyRepository,
      validateCnpjRepository
    );

    const result = await sut.execute(createCompanyDto);

    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityAlreadyExists);
  });

  it('should return EntityIsInvalid when a invalid cnpj', async () => {
    const {
      createCompanyDto,
      createCompanyRepository,
      filterCompanyByCnpjRepository,
    } = makeSut();

    const mockInvalidRepository: ValidateCNPJRepository = {
      validate: jest.fn(async () => false),
    };

    const sut = new CreateCompany(
      filterCompanyByCnpjRepository,
      createCompanyRepository,
      mockInvalidRepository
    );

    const result = await sut.execute(createCompanyDto);

    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityIsInvalid);
  });
});
