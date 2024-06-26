import {
  ContentFile,
  Directory,
  EntityNotEmpty,
  EntityNotExists,
  FindContentFileByIdRepository,
  FindDirectoryByIdRepository,
  FindUserByIdRepository,
  MoveFileToDirectory,
  MoveFileToDirectoryDto,
  MoveFileToDirectoryRepository,
  UserList,
} from '../../../src';
import { ContentFileMock, DirectoryMock, userMock } from '../../entity';
import {
  FindContentFileByIdRepositoryMock,
  FindDirectoryByIdRespositoryMock,
  FindUserByIdRepositoryMock,
  MoveFileToDirectoryRepositoryMock,
} from '../../repository';

interface SutTypes {
  sut: MoveFileToDirectory;
  moveFileToDirectoryDto: MoveFileToDirectoryDto;
  findUserByIdRepository: FindUserByIdRepository;
  findDirectoryByIdRepository: FindDirectoryByIdRepository;
  findContentFileByIdRepository: FindContentFileByIdRepository;
  moveFileToDirectoryRepository: MoveFileToDirectoryRepository;
}

const makeSut = (): SutTypes => {
  const findUserByIdRepository = new FindUserByIdRepositoryMock();
  const findDirectoryByIdRepository = new FindDirectoryByIdRespositoryMock();
  const findContentFileByIdRepository = new FindContentFileByIdRepositoryMock();
  const moveFileToDirectoryRepository = new MoveFileToDirectoryRepositoryMock();
  const moveFileToDirectoryDto: MoveFileToDirectoryDto = {
    idToMove: ContentFileMock.id,
    idToMoveDirectory: DirectoryMock.id,
    loggedUserId: userMock.userId,
  };

  const sut = new MoveFileToDirectory(
    findUserByIdRepository,
    findDirectoryByIdRepository,
    findContentFileByIdRepository,
    moveFileToDirectoryRepository
  );

  return {
    moveFileToDirectoryRepository,
    findUserByIdRepository,
    findDirectoryByIdRepository,
    findContentFileByIdRepository,
    moveFileToDirectoryDto,
    sut,
  };
};

describe('MoveFileToDirectory', () => {
  it('should return void when a correct move file to directory', async () => {
    const { moveFileToDirectoryDto, sut } = makeSut();

    const result = await sut.execute(moveFileToDirectoryDto);
    expect(result.isLeft()).toBe(false);
    expect(result.isRight()).toBe(true);
    expect(result.value).toStrictEqual(undefined);
  });

  it('should return EntityNotEmpty when a pass incorrect logged user id', async () => {
    const { moveFileToDirectoryDto, sut } = makeSut();
    moveFileToDirectoryDto.loggedUserId = '';
    const result = await sut.execute(moveFileToDirectoryDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when a pass incorrect directory id', async () => {
    const { moveFileToDirectoryDto, sut } = makeSut();
    moveFileToDirectoryDto.idToMoveDirectory = '';
    const result = await sut.execute(moveFileToDirectoryDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when a pass incorrect id to move', async () => {
    const { moveFileToDirectoryDto, sut } = makeSut();
    moveFileToDirectoryDto.idToMove = '';
    const result = await sut.execute(moveFileToDirectoryDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotExists if there is no user created in the database', async () => {
    const {
      moveFileToDirectoryDto,
      findDirectoryByIdRepository,
      moveFileToDirectoryRepository,
      findContentFileByIdRepository,
    } = makeSut();

    const mockEmptyItem = {} as UserList;

    const mockEmptyRepository: FindUserByIdRepository = {
      find: jest.fn(async () => mockEmptyItem),
    };

    const sut = new MoveFileToDirectory(
      mockEmptyRepository,
      findDirectoryByIdRepository,
      findContentFileByIdRepository,
      moveFileToDirectoryRepository
    );

    const result = await sut.execute(moveFileToDirectoryDto);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });

  it('should return EntityNotExists if there is no directory created in the database', async () => {
    const {
      moveFileToDirectoryDto,
      findUserByIdRepository,
      moveFileToDirectoryRepository,
      findContentFileByIdRepository,
    } = makeSut();

    const mockEmptyItem = {} as Directory;

    const mockEmptyRepository: FindDirectoryByIdRepository = {
      find: jest.fn(async () => mockEmptyItem),
    };

    const sut = new MoveFileToDirectory(
      findUserByIdRepository,
      mockEmptyRepository,
      findContentFileByIdRepository,
      moveFileToDirectoryRepository
    );

    const result = await sut.execute(moveFileToDirectoryDto);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });

  it('should return EntityNotExists if there is no content file created in the database', async () => {
    const {
      moveFileToDirectoryDto,
      findUserByIdRepository,
      moveFileToDirectoryRepository,
      findDirectoryByIdRepository,
    } = makeSut();

    const mockEmptyItem = {} as ContentFile;

    const mockEmptyRepository: FindContentFileByIdRepository = {
      find: jest.fn(async () => mockEmptyItem),
    };

    const sut = new MoveFileToDirectory(
      findUserByIdRepository,
      findDirectoryByIdRepository,
      mockEmptyRepository,
      moveFileToDirectoryRepository
    );

    const result = await sut.execute(moveFileToDirectoryDto);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });
});
