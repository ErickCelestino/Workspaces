import {
  ConsultCNPJRepository,
  CreateCompany,
  CreateCompanyDto,
  CreateCompanyRepository,
  EntityAlreadyExists,
  EntityIsInvalid,
  FilterCompanyByCnpjRepository,
  InsufficientCharacters,
  ValidateCNPJRepository,
  ConsultCNPJResponse,
  CreateCompanyAddressRepository,
  FilterCityByNameRepository,
  City,
  EntityNotExists,
} from '../../../src';
import { companyMock } from '../../entity';
import {
  ConsultCNPJRepositoryMock,
  CreateCompanyAddressRepositoryMock,
  CreateCompanyRepositoryMock,
  FilterCityByRepositoryMock,
  FilterCompanyByCnpjRepositoryMock,
  ValidateCNPJRepositoryMock,
} from '../../repository';

interface SutTypes {
  sut: CreateCompany;
  createCompanyDto: CreateCompanyDto;
  createCompanyRepository: CreateCompanyRepository;
  filterCompanyByCnpjRepository: FilterCompanyByCnpjRepository;
  validateCnpjRepository: ValidateCNPJRepository;
  consultCnpjRepository: ConsultCNPJRepository;
  createCompanyAddressRepository: CreateCompanyAddressRepository;
  filterCityByNameRepository: FilterCityByNameRepository;
}

const makeSut = (): SutTypes => {
  const createCompanyRepository = new CreateCompanyRepositoryMock();
  const filterCompanyByCnpjRepository = new FilterCompanyByCnpjRepositoryMock();
  const validateCnpjRepository = new ValidateCNPJRepositoryMock();
  const consultCnpjRepository = new ConsultCNPJRepositoryMock();
  const createCompanyAddressRepository =
    new CreateCompanyAddressRepositoryMock();
  const filterCityByNameRepository = new FilterCityByRepositoryMock();

  const createCompanyDto: CreateCompanyDto = {
    fantasy_name: companyMock.name,
    cnpj: companyMock.cnpj,
  };

  const sut = new CreateCompany(
    filterCompanyByCnpjRepository,
    createCompanyRepository,
    validateCnpjRepository,
    consultCnpjRepository,
    createCompanyAddressRepository,
    filterCityByNameRepository
  );

  return {
    createCompanyRepository,
    filterCompanyByCnpjRepository,
    validateCnpjRepository,
    consultCnpjRepository,
    createCompanyAddressRepository,
    filterCityByNameRepository,
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
      fantasy_name: '',
      cnpj: companyMock.cnpj,
    };

    const result = await sut.execute(createUserDto);

    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(InsufficientCharacters);
  });

  it('should return InsufficientCharacters when a incorrect cnpj', async () => {
    const { sut } = makeSut();

    const createUserDto: CreateCompanyDto = {
      fantasy_name: companyMock.name,
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
      consultCnpjRepository,
      createCompanyAddressRepository,
      filterCityByNameRepository,
    } = makeSut();

    const mockInvalidRepository: FilterCompanyByCnpjRepository = {
      filter: jest.fn(async () => companyMock),
    };

    const sut = new CreateCompany(
      mockInvalidRepository,
      createCompanyRepository,
      validateCnpjRepository,
      consultCnpjRepository,
      createCompanyAddressRepository,
      filterCityByNameRepository
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
      consultCnpjRepository,
      createCompanyAddressRepository,
      filterCityByNameRepository,
    } = makeSut();

    const mockInvalidRepository: ValidateCNPJRepository = {
      validate: jest.fn(() => false),
    };

    const sut = new CreateCompany(
      filterCompanyByCnpjRepository,
      createCompanyRepository,
      mockInvalidRepository,
      consultCnpjRepository,
      createCompanyAddressRepository,
      filterCityByNameRepository
    );

    const result = await sut.execute(createCompanyDto);

    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityIsInvalid);
  });

  it('should return EntityIsInvalid if consult cnpj is invalid', async () => {
    const {
      createCompanyDto,
      createCompanyRepository,
      filterCompanyByCnpjRepository,
      validateCnpjRepository,
      createCompanyAddressRepository,
      filterCityByNameRepository,
    } = makeSut();

    const mockEmptyReponse: ConsultCNPJResponse = {} as ConsultCNPJResponse;

    const mockInvalidRepository: ConsultCNPJRepository = {
      consult: jest.fn(async () => mockEmptyReponse),
    };

    const sut = new CreateCompany(
      filterCompanyByCnpjRepository,
      createCompanyRepository,
      validateCnpjRepository,
      mockInvalidRepository,
      createCompanyAddressRepository,
      filterCityByNameRepository
    );

    const result = await sut.execute(createCompanyDto);

    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityIsInvalid);
  });

  it('should return EntityNotExists if city not exist in system', async () => {
    const {
      createCompanyDto,
      createCompanyRepository,
      filterCompanyByCnpjRepository,
      validateCnpjRepository,
      createCompanyAddressRepository,
      consultCnpjRepository,
    } = makeSut();

    const mockEmptyReponse: City = {} as City;

    const mockInvalidRepository: FilterCityByNameRepository = {
      filter: jest.fn(async () => mockEmptyReponse),
    };

    const sut = new CreateCompany(
      filterCompanyByCnpjRepository,
      createCompanyRepository,
      validateCnpjRepository,
      consultCnpjRepository,
      createCompanyAddressRepository,
      mockInvalidRepository
    );

    const result = await sut.execute(createCompanyDto);

    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });
});
