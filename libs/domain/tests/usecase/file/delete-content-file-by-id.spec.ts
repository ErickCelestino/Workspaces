import {
  FindUserByIdRepository,
  FindDirectoryByIdRepository,
  EntityNotEmpty,
  UserList,
  EntityNotExists,
  Directory,
  ListContentFile,
  DeleteContentFileById,
  DeleteContentFileByIdDto,
  DeleteContentFileByIdRepository,
  FindContentFileByIdRepository,
  ContentFile,
} from '../../../src';
import {
  ContentFileMock,
  DirectoryMock,
  ListContentFileReponseMock,
  userMock,
} from '../../entity';
import {
  DeleteContentFileByIdRepositoryMock,
  FindContentFileByIdRepositoryMock,
  FindDirectoryByIdRespositoryMock,
  FindUserByIdRepositoryMock,
} from '../../repository';

interface SutTypes {
  sut: DeleteContentFileById;
  deleteContentFileByIdDto: DeleteContentFileByIdDto;
  findUserByIdRepository: FindUserByIdRepository;
  findDirectoryByIdRepository: FindDirectoryByIdRepository;
  deleteContentFileByIdRepository: DeleteContentFileByIdRepository;
  findContentFileByIdRepository: FindContentFileByIdRepository;
}

const makeSut = (): SutTypes => {
  const deleteContentFileByIdRepository =
    new DeleteContentFileByIdRepositoryMock();
  const findUserByIdRepository = new FindUserByIdRepositoryMock();
  const findDirectoryByIdRepository = new FindDirectoryByIdRespositoryMock();
  const findContentFileByIdRepository = new FindContentFileByIdRepositoryMock();
  const deleteContentFileByIdDto: DeleteContentFileByIdDto = {
    directoryId: DirectoryMock.id,
    loggedUserId: userMock.userId,
    idToDelete: ContentFileMock.id,
  };

  const sut = new DeleteContentFileById(
    deleteContentFileByIdRepository,
    findUserByIdRepository,
    findDirectoryByIdRepository,
    findContentFileByIdRepository
  );

  return {
    deleteContentFileByIdRepository,
    findUserByIdRepository,
    findDirectoryByIdRepository,
    findContentFileByIdRepository,
    deleteContentFileByIdDto,
    sut,
  };
};

describe('DeleteContentFileById', () => {
  it('should return void when a correct content file is delected', async () => {
    const { deleteContentFileByIdDto, sut } = makeSut();

    const result = await sut.execute(deleteContentFileByIdDto);
    expect(result.isLeft()).toBe(false);
    expect(result.isRight()).toBe(true);
    expect(result.value).toStrictEqual(undefined);
  });

  it('should return EntityNotEmpty when a pass incorrect logged user id', async () => {
    const { deleteContentFileByIdDto, sut } = makeSut();
    deleteContentFileByIdDto.loggedUserId = '';
    const result = await sut.execute(deleteContentFileByIdDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when a pass incorrect directory id', async () => {
    const { deleteContentFileByIdDto, sut } = makeSut();
    deleteContentFileByIdDto.directoryId = '';
    const result = await sut.execute(deleteContentFileByIdDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when a pass incorrect id to delete', async () => {
    const { deleteContentFileByIdDto, sut } = makeSut();
    deleteContentFileByIdDto.idToDelete = '';
    const result = await sut.execute(deleteContentFileByIdDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotExists if there is no user created in the database', async () => {
    const {
      deleteContentFileByIdDto,
      findDirectoryByIdRepository,
      deleteContentFileByIdRepository,
      findContentFileByIdRepository,
    } = makeSut();

    const mockEmptyItem = {} as UserList;

    const mockEmptyRepository: FindUserByIdRepository = {
      find: jest.fn(async () => mockEmptyItem),
    };

    const sut = new DeleteContentFileById(
      deleteContentFileByIdRepository,
      mockEmptyRepository,
      findDirectoryByIdRepository,
      findContentFileByIdRepository
    );

    const result = await sut.execute(deleteContentFileByIdDto);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });

  it('should return EntityNotExists if there is no directory created in the database', async () => {
    const {
      deleteContentFileByIdDto,
      findUserByIdRepository,
      deleteContentFileByIdRepository,
      findContentFileByIdRepository,
    } = makeSut();

    const mockEmptyItem = {} as Directory;

    const mockEmptyRepository: FindDirectoryByIdRepository = {
      find: jest.fn(async () => mockEmptyItem),
    };

    const sut = new DeleteContentFileById(
      deleteContentFileByIdRepository,
      findUserByIdRepository,
      mockEmptyRepository,
      findContentFileByIdRepository
    );

    const result = await sut.execute(deleteContentFileByIdDto);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });

  it('should return EntityNotExists if there is no content file created in the database', async () => {
    const {
      deleteContentFileByIdDto,
      findUserByIdRepository,
      deleteContentFileByIdRepository,
      findDirectoryByIdRepository,
    } = makeSut();

    const mockEmptyItem = {} as ContentFile;

    const mockEmptyRepository: FindContentFileByIdRepository = {
      find: jest.fn(async () => mockEmptyItem),
    };

    const sut = new DeleteContentFileById(
      deleteContentFileByIdRepository,
      findUserByIdRepository,
      findDirectoryByIdRepository,
      mockEmptyRepository
    );

    const result = await sut.execute(deleteContentFileByIdDto);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });
});
