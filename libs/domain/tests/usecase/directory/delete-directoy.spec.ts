import {
  DeleteDirectory,
  DeleteDirectoryDto,
  DeleteDirectoryRepository,
  Directory,
  EntityNotEmpty,
  EntityNotExists,
  FindDirectoryByIdRepository,
  FindUserByIdRepository,
  UserList,
} from '../../../src';
import { DirectoryMock, userMock } from '../../entity';
import {
  DeleteDirectoryRepositoryMock,
  FindDirectoryByIdRespositoryMock,
  FindUserByIdRepositoryMock,
} from '../../repository';

interface sutTypes {
  sut: DeleteDirectory;
  deleteDirectoryDto: DeleteDirectoryDto;
  findUserByIdRepository: FindUserByIdRepository;
  findDirectoryByIdRepository: FindDirectoryByIdRepository;
  deleteDirectoryRepository: DeleteDirectoryRepository;
}

const makeSut = (): sutTypes => {
  const findUserByIdRepository = new FindUserByIdRepositoryMock();
  const findDirectoryByIdRepository = new FindDirectoryByIdRespositoryMock();
  const deleteDirectoryRepository = new DeleteDirectoryRepositoryMock();

  const deleteDirectoryDto: DeleteDirectoryDto = {
    id: DirectoryMock.id,
    loggedUserId: userMock.userId,
  };

  const sut = new DeleteDirectory(
    findUserByIdRepository,
    findDirectoryByIdRepository,
    deleteDirectoryRepository
  );

  return {
    sut,
    deleteDirectoryDto,
    findUserByIdRepository,
    findDirectoryByIdRepository,
    deleteDirectoryRepository,
  };
};

describe('DeleteDirectory', () => {
  it('should return void when pass correct DeleteDirectoryDto', async () => {
    const { sut, deleteDirectoryDto } = makeSut();

    const result = await sut.execute(deleteDirectoryDto);

    expect(result.isRight()).toBe(true);
    expect(result.isLeft()).toBe(false);
    expect(result.value).toBe(undefined);
  });

  it('should return EntityNotEmpty when pass incorrect id', async () => {
    const { sut, deleteDirectoryDto } = makeSut();
    deleteDirectoryDto.id = '';
    const result = await sut.execute(deleteDirectoryDto);

    expect(result.isRight()).toBe(false);
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when pass incorrect Logged User ID', async () => {
    const { sut, deleteDirectoryDto } = makeSut();
    deleteDirectoryDto.loggedUserId = '';
    const result = await sut.execute(deleteDirectoryDto);

    expect(result.isRight()).toBe(false);
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotExists when a exist User in system', async () => {
    const { deleteDirectoryDto, sut } = makeSut();
    jest
      .spyOn(sut['findUserByIdRepository'], 'find')
      .mockResolvedValueOnce({} as UserList);
    const result = await sut.execute(deleteDirectoryDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });

  it('should return EntityNotExists when a exist device in system', async () => {
    const { deleteDirectoryDto, sut } = makeSut();
    jest
      .spyOn(sut['findDirectoryByIdRepository'], 'find')
      .mockResolvedValueOnce({} as Directory);
    const result = await sut.execute(deleteDirectoryDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });
});
