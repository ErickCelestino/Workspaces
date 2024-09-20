import {
  CompanyResponseDto,
  EntityNotEmpty,
  EntityNotExists,
  EntityNotFound,
  FindCompanyByIdRepository,
  FindUnauthorizedUsersByCompanyId,
  FindUnauthorizedUsersByCompanyIdDto,
  FindUnauthorizedUsersByCompanyIdRepository,
  FindUserByIdRepository,
  UserList,
} from '../../../../src';
import { CompanyMock, listUserMock, userMock } from '../../../entity';
import {
  FindCompanyByIdRepositoryMock,
  FindUnauthorizedUsersByCompanyIdRepositoryMock,
  FindUserByIdRepositoryMock,
} from '../../../repository';

interface SutTypes {
  sut: FindUnauthorizedUsersByCompanyId;
  findUnauthorizedUsersByCompanyIdDto: FindUnauthorizedUsersByCompanyIdDto;
  findUserByIdRepository: FindUserByIdRepository;
  findCompanyByIdRepository: FindCompanyByIdRepository;
  findUnauthorizedUsersByCompanyIRepository: FindUnauthorizedUsersByCompanyIdRepository;
}

const makeSut = (): SutTypes => {
  const findUserByIdRepository = new FindUserByIdRepositoryMock();
  const findCompanyByIdRepository = new FindCompanyByIdRepositoryMock();
  const findUnauthorizedUsersByCompanyIRepository =
    new FindUnauthorizedUsersByCompanyIdRepositoryMock();

  const findUnauthorizedUsersByCompanyIdDto: FindUnauthorizedUsersByCompanyIdDto =
    {
      companyId: CompanyMock.simple.id,
      loggedUserId: userMock.userId,
    };

  const sut = new FindUnauthorizedUsersByCompanyId(
    findUserByIdRepository,
    findCompanyByIdRepository,
    findUnauthorizedUsersByCompanyIRepository
  );

  return {
    findUserByIdRepository,
    findCompanyByIdRepository,
    findUnauthorizedUsersByCompanyIRepository,
    findUnauthorizedUsersByCompanyIdDto,
    sut,
  };
};

describe('FindUnauthorizedUsersByCompanyId', () => {
  it('should return user unauthorized list when pass correct findUnauthorizedUsersByCompanyIdDto', async () => {
    const { findUnauthorizedUsersByCompanyIdDto, sut } = makeSut();

    const result = await sut.execute(findUnauthorizedUsersByCompanyIdDto);

    expect(result.isLeft()).toBeFalsy();
    expect(result.isRight()).toBeTruthy();
    expect(result.value).toStrictEqual(listUserMock);
  });

  it('should return EntityNotEmpty when pass incorrect Company id', async () => {
    const { sut, findUnauthorizedUsersByCompanyIdDto } = makeSut();
    findUnauthorizedUsersByCompanyIdDto.companyId = '';
    const result = await sut.execute(findUnauthorizedUsersByCompanyIdDto);

    expect(result.isRight()).toBe(false);
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when pass incorrect Logged User id', async () => {
    const { sut, findUnauthorizedUsersByCompanyIdDto } = makeSut();
    findUnauthorizedUsersByCompanyIdDto.loggedUserId = '';
    const result = await sut.execute(findUnauthorizedUsersByCompanyIdDto);

    expect(result.isRight()).toBe(false);
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotExists when a exist User in system', async () => {
    const { findUnauthorizedUsersByCompanyIdDto, sut } = makeSut();
    jest
      .spyOn(sut['findUserByIdRepository'], 'find')
      .mockResolvedValueOnce({} as UserList);
    const result = await sut.execute(findUnauthorizedUsersByCompanyIdDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });

  it('should return EntityNotExists when a exist Company in system', async () => {
    const { findUnauthorizedUsersByCompanyIdDto, sut } = makeSut();
    jest
      .spyOn(sut['findCompanyByIdRepository'], 'find')
      .mockResolvedValueOnce({} as CompanyResponseDto);
    const result = await sut.execute(findUnauthorizedUsersByCompanyIdDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });

  it('should return EntityNotFound when a exist user unauthorized in Company', async () => {
    const { findUnauthorizedUsersByCompanyIdDto, sut } = makeSut();
    jest
      .spyOn(sut['findUnauthorizedUsersByCompanyIdRepository'], 'find')
      .mockResolvedValueOnce([]);
    const result = await sut.execute(findUnauthorizedUsersByCompanyIdDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotFound);
  });
});
