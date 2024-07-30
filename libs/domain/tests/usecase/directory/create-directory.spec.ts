import {
  CreateDirectoryDto,
  CreateDirectoryRepository,
  EntityNotEmpty,
  FindDirectoryByNameRepository,
  FindUserByIdRepository,
} from '../../../src';
import { CreateDirectory } from '../../../src/lib/use-case';
import { DirectoryMock, userMock } from '../../entity';
import { FindUserByIdRepositoryMock } from '../../repository';
import { CreateDirectoryRepositoryMock } from '../../repository/directory/create-directory.mock';
import { FindDirectoryByNameRepositoryMock } from '../../repository/directory/find-directory-by-name.mock';

interface SutTypes {
  sut: CreateDirectory;
  CreateDirectoryDto: CreateDirectoryDto;
  FindUserByIdRepository: FindUserByIdRepository;
  FindDirectoryByNameRepository: FindDirectoryByNameRepository;
  CreateDirectoryRepository: CreateDirectoryRepository;
}

const makeSut = (): SutTypes => {
  const CreateDirectoryRepository = new CreateDirectoryRepositoryMock();
  const FindUserByIdRepository = new FindUserByIdRepositoryMock();
  const FindDirectoryByNameRepository = new FindDirectoryByNameRepositoryMock();

  const CreateDirectoryDto: CreateDirectoryDto = {
    body: { name: DirectoryMock.name },
    loggedUserId: userMock.userId,
  };

  const sut = new CreateDirectory(
    FindUserByIdRepository,
    FindDirectoryByNameRepository,
    CreateDirectoryRepository
  );

  return {
    CreateDirectoryRepository,
    FindDirectoryByNameRepository,
    FindUserByIdRepository,
    CreateDirectoryDto,
    sut,
  };
};

describe('CreateDirectory', () => {
  it('ensure it will return a string when all data is correct', async () => {
    const { sut, CreateDirectoryDto } = makeSut();
    const result = await sut.execute(CreateDirectoryDto);
    expect(result.isRight()).toBe(true);
  });

  it('ensure it will return EntityNotEmpty error if the name field is empty', async () => {
    const { sut, CreateDirectoryDto } = makeSut();
    CreateDirectoryDto.body.name = '';
    const result = await sut.execute(CreateDirectoryDto);
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('ensure it will return EntityNotEmpty error if the loggedUserId field is empty', async () => {
    const { sut, CreateDirectoryDto } = makeSut();
    CreateDirectoryDto.loggedUserId = '';
    const result = await sut.execute(CreateDirectoryDto);
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('ensure it will return EntityAlreadyExists error if the directory already exists', async () => {
    const { sut, CreateDirectoryDto, FindDirectoryByNameRepository } =
      makeSut();
    jest
      .spyOn(FindDirectoryByNameRepository, 'find')
      .mockResolvedValueOnce(DirectoryMock);
    const result = await sut.execute(CreateDirectoryDto);
    expect(result.isLeft()).toBe(true);
  });

  it('ensure it will return EntityNotCreated error if the directory is not created', async () => {
    const { sut, CreateDirectoryDto, CreateDirectoryRepository } = makeSut();
    jest.spyOn(CreateDirectoryRepository, 'create').mockResolvedValueOnce('');
    const result = await sut.execute(CreateDirectoryDto);
    expect(result.isLeft()).toBe(true);
  });
});
