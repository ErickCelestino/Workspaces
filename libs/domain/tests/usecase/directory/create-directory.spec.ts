import {
  CreateDirectoryDto,
  CreateDirectoryRepository,
  EntityNotEmpty,
  EntityNotExists,
  FindDirectoryByNameRepository,
  FindUserByIdRepository,
  UserList,
} from '../../../src';
import { CreateDirectory } from '../../../src/lib/use-case';
import { DirectoryMock, userMock } from '../../entity';
import { FindUserByIdRepositoryMock } from '../../repository';
import { CreateDirectoryRepositoryMock } from '../../repository/directory/create-directory.mock';
import { FindDirectoryByNameRepositoryMock } from '../../repository/directory/find-directory-by-name.mock';

interface SutTypes {
  sut: CreateDirectory;
  createDirectoryDto: CreateDirectoryDto;
  findUserByIdRepository: FindUserByIdRepository;
  findDirectoryByNameRepository: FindDirectoryByNameRepository;
  createDirectoryRepository: CreateDirectoryRepository;
}

const makeSut = (): SutTypes => {
  const createDirectoryRepository = new CreateDirectoryRepositoryMock();
  const findUserByIdRepository = new FindUserByIdRepositoryMock();
  const findDirectoryByNameRepository = new FindDirectoryByNameRepositoryMock();

  const createDirectoryDto: CreateDirectoryDto = {
    body: { name: DirectoryMock.name },
    loggedUserId: userMock.userId,
  };

  const sut = new CreateDirectory(
    findUserByIdRepository,
    findDirectoryByNameRepository,
    createDirectoryRepository
  );

  return {
    createDirectoryRepository: createDirectoryRepository,
    findDirectoryByNameRepository: findDirectoryByNameRepository,
    findUserByIdRepository: findUserByIdRepository,
    createDirectoryDto: createDirectoryDto,
    sut,
  };
};

describe('CreateDirectory', () => {
  it('ensure it will return a string when all data is correct', async () => {
    const { sut, createDirectoryDto: CreateDirectoryDto } = makeSut();
    const result = await sut.execute(CreateDirectoryDto);
    expect(result.isRight()).toBe(true);
  });

  it('ensure it will return EntityNotEmpty error if the name field is empty', async () => {
    const { sut, createDirectoryDto: CreateDirectoryDto } = makeSut();
    CreateDirectoryDto.body.name = '';
    const result = await sut.execute(CreateDirectoryDto);
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('ensure it will return EntityNotEmpty error if the loggedUserId field is empty', async () => {
    const { sut, createDirectoryDto: CreateDirectoryDto } = makeSut();
    CreateDirectoryDto.loggedUserId = '';
    const result = await sut.execute(CreateDirectoryDto);
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('ensure it will return EntityAlreadyExists error if the directory already exists', async () => {
    const {
      sut,
      createDirectoryDto: CreateDirectoryDto,
      findDirectoryByNameRepository: FindDirectoryByNameRepository,
    } = makeSut();
    jest
      .spyOn(FindDirectoryByNameRepository, 'find')
      .mockResolvedValueOnce(DirectoryMock);
    const result = await sut.execute(CreateDirectoryDto);
    expect(result.isLeft()).toBe(true);
  });

  it('ensure it will return EntityNotCreated error if the directory is not created', async () => {
    const {
      sut,
      createDirectoryDto: CreateDirectoryDto,
      createDirectoryRepository: CreateDirectoryRepository,
    } = makeSut();
    jest.spyOn(CreateDirectoryRepository, 'create').mockResolvedValueOnce('');
    const result = await sut.execute(CreateDirectoryDto);
    expect(result.isLeft()).toBe(true);
  });

  it('should return EntityNotExists when a pass incorrect Logged User ID', async () => {
    const { createDirectoryDto, sut } = makeSut();
    jest
      .spyOn(sut['findUserByIdRepository'], 'find')
      .mockResolvedValueOnce({} as UserList);
    const result = await sut.execute(createDirectoryDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });
});
