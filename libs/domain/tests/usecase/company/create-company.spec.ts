import {
  CreateCompany,
  CreateCompanyDto,
  CreateCompanyRepository,
  EntityAlreadyExists,
  EntityNotCreated,
  EntityNotEmpty,
  EntityNotExists,
  FindCompanyByCnpjRepository,
  FindUserByIdRepository,
  UserList,
} from '../../../src';
import { CompanyMock, userMock } from '../../entity';
import {
  FindUserByIdRepositoryMock,
  FindCompanyByCnpjRepositoryMock,
  CreateCompanyRepositoryMock,
} from '../../repository';

interface SutTypes {
  sut: CreateCompany;
  createCompanyDto: CreateCompanyDto;
  findUserByIdRepository: FindUserByIdRepository;
  findCompanyByCnpjRepository: FindCompanyByCnpjRepository;
  createCompanyRepository: CreateCompanyRepository;
}

const makeSut = (): SutTypes => {
  const findUserByIdRepository = new FindUserByIdRepositoryMock();
  const findCompanyByCnpjRepository = new FindCompanyByCnpjRepositoryMock();
  const createCompanyRepository = new CreateCompanyRepositoryMock();

  const createCompanyDto: CreateCompanyDto = {
    body: {
      cnpj: CompanyMock.cnpj,
      fantasyName: CompanyMock.fantasyName,
      socialReason: CompanyMock.socialReason,
    },
    loggedUserId: userMock.userId,
  };

  const sut = new CreateCompany(
    findUserByIdRepository,
    findCompanyByCnpjRepository,
    createCompanyRepository
  );

  return {
    sut,
    createCompanyDto,
    findUserByIdRepository,
    findCompanyByCnpjRepository,
    createCompanyRepository,
  };
};

describe('CreateCompany', () => {
  it('should return company id when pass correct createCompanyDto', async () => {
    const { createCompanyDto, sut } = makeSut();

    const result = await sut.execute(createCompanyDto);

    expect(result.isRight()).toBeTruthy();
    expect(result.isLeft()).toBeFalsy();
    expect(result.value).toStrictEqual(CompanyMock.id);
  });

  it('should return EntityNotEmpty when pass incorrect Logged User id', async () => {
    const { sut, createCompanyDto } = makeSut();
    createCompanyDto.loggedUserId = '';
    const result = await sut.execute(createCompanyDto);

    expect(result.isRight()).toBe(false);
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when pass incorrect CNPJ', async () => {
    const { sut, createCompanyDto } = makeSut();
    createCompanyDto.body.cnpj = '';
    const result = await sut.execute(createCompanyDto);

    expect(result.isRight()).toBe(false);
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when pass incorrect Fantasy name', async () => {
    const { sut, createCompanyDto } = makeSut();
    createCompanyDto.body.fantasyName = '';
    const result = await sut.execute(createCompanyDto);

    expect(result.isRight()).toBe(false);
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when pass incorrect Social Reason', async () => {
    const { sut, createCompanyDto } = makeSut();
    createCompanyDto.body.socialReason = '';
    const result = await sut.execute(createCompanyDto);

    expect(result.isRight()).toBe(false);
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityAlreadyExists when exist cnpj in system', async () => {
    const { sut, createCompanyDto } = makeSut();
    jest
      .spyOn(sut['findCompanyByCnpjRepository'], 'find')
      .mockResolvedValueOnce(CompanyMock);
    const result = await sut.execute(createCompanyDto);

    expect(result.isRight()).toBe(false);
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityAlreadyExists);
  });

  it('should return EntityNotExists when a exist User in system', async () => {
    const { createCompanyDto, sut } = makeSut();
    jest
      .spyOn(sut['findUserByIdRepository'], 'find')
      .mockResolvedValueOnce({} as UserList);
    const result = await sut.execute(createCompanyDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });

  it('should return EntityNotCreated when not created company in system', async () => {
    const { sut, createCompanyDto } = makeSut();
    jest
      .spyOn(sut['createCompanyRepository'], 'create')
      .mockResolvedValueOnce('');
    const result = await sut.execute(createCompanyDto);

    expect(result.isRight()).toBe(false);
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotCreated);
  });
});
