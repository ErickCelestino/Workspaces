import { faker } from '@faker-js/faker';
import {
  FindUserByIdRepository,
  FindDirectoryByIdRepository,
  EntityNotEmpty,
  ListContentFile,
  ListContentFileDto,
  ListContentFileRepository,
} from '../../../src';
import {
  DirectoryMock,
  ListContentFileReponseMock,
  userMock,
} from '../../entity';
import {
  FindDirectoryByIdRespositoryMock,
  FindUserByIdRepositoryMock,
  ListContentFileRepositoryMock,
} from '../../repository';

interface SutTypes {
  sut: ListContentFile;
  listContentFileDto: ListContentFileDto;
  findUserByIdRepository: FindUserByIdRepository;
  findDirectoryByIdRepository: FindDirectoryByIdRepository;
  listContentFileRepository: ListContentFileRepository;
}

const makeSut = (): SutTypes => {
  const listContentFileRepository = new ListContentFileRepositoryMock();
  const findUserByIdRepository = new FindUserByIdRepositoryMock();
  const findDirectoryByIdRepository = new FindDirectoryByIdRespositoryMock();
  const listContentFileDto: ListContentFileDto = {
    directoryId: DirectoryMock.id,
    loggedUserId: userMock.userId,
    userInput: faker.string.alpha(3),
  };

  const sut = new ListContentFile(
    listContentFileRepository,
    findUserByIdRepository,
    findDirectoryByIdRepository
  );

  return {
    listContentFileRepository,
    findUserByIdRepository,
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
});
