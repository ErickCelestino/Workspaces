import { faker } from '@faker-js/faker';
import {
  FindUserByIdRepository,
  FindDirectoryByIdRepository,
  EntityNotEmpty,
  ListContentFile,
  ListContentFileDto,
  ListContentFileRepository,
  UserList,
  EntityNotExists,
  Directory,
  FindCompanyByIdRepository,
} from '../../../src';
import {
  CompanyAddressMock,
  CompanyMock,
  DirectoryMock,
  ListContentFileReponseMock,
  userMock,
} from '../../entity';
import {
  FindCompanyByIdRepositoryMock,
  FindDirectoryByIdRespositoryMock,
  FindUserByIdRepositoryMock,
  ListContentFileRepositoryMock,
} from '../../repository';

interface SutTypes {
  sut: ListContentFile;
  listContentFileDto: ListContentFileDto;
  findUserByIdRepository: FindUserByIdRepository;
  findCompanyByIdRepository: FindCompanyByIdRepository;
  findDirectoryByIdRepository: FindDirectoryByIdRepository;
  listContentFileRepository: ListContentFileRepository;
}

const makeSut = (): SutTypes => {
  const listContentFileRepository = new ListContentFileRepositoryMock();
  const findUserByIdRepository = new FindUserByIdRepositoryMock();
  const findDirectoryByIdRepository = new FindDirectoryByIdRespositoryMock();
  const findCompanyByIdRepository = new FindCompanyByIdRepositoryMock();
  const listContentFileDto: ListContentFileDto = {
    directoryId: DirectoryMock.id,
    loggedUserId: userMock.userId,
    companyId: CompanyMock.simple.id,
    userInput: faker.string.alpha(3),
  };

  const sut = new ListContentFile(
    listContentFileRepository,
    findUserByIdRepository,
    findCompanyByIdRepository,
    findDirectoryByIdRepository
  );

  return {
    listContentFileRepository,
    findUserByIdRepository,
    findCompanyByIdRepository,
    findDirectoryByIdRepository,
    listContentFileDto,
    sut,
  };
};

describe('ListContentFile', () => {
  it('should return void when a correct content video is created', async () => {
    const { listContentFileDto, sut } = makeSut();

    const result = await sut.execute(listContentFileDto);
    expect(result.isLeft()).toBe(false);
    expect(result.isRight()).toBe(true);
    expect(result.value).toStrictEqual(ListContentFileReponseMock);
  });

  it('should return EntityNotEmpty when a pass incorrect logged user id', async () => {
    const { listContentFileDto, sut } = makeSut();
    listContentFileDto.loggedUserId = '';
    const result = await sut.execute(listContentFileDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when a pass incorrect directory id', async () => {
    const { listContentFileDto, sut } = makeSut();
    listContentFileDto.directoryId = '';
    const result = await sut.execute(listContentFileDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when a pass incorrect user id', async () => {
    const { listContentFileDto, sut } = makeSut();
    listContentFileDto.loggedUserId = '';
    const result = await sut.execute(listContentFileDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotExists when a pass incorrect Logged User ID', async () => {
    const { listContentFileDto, sut } = makeSut();
    jest
      .spyOn(sut['findUserByIdRepository'], 'find')
      .mockResolvedValueOnce({} as UserList);
    const result = await sut.execute(listContentFileDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });

  it('should return EntityNotExists when a pass incorrect Directory ID', async () => {
    const { listContentFileDto, sut } = makeSut();
    jest
      .spyOn(sut['findDirectoryByIdRepository'], 'find')
      .mockResolvedValueOnce({} as Directory);
    const result = await sut.execute(listContentFileDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });
});
