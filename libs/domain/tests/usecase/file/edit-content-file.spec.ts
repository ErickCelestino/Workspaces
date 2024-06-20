import {
  ContentFile,
  Directory,
  EditContentFile,
  EditContentFileDto,
  EditContentFileRepository,
  EntityNotEmpty,
  EntityNotExists,
  FindContentFileByIdRepository,
  FindDirectoryByIdRepository,
  FindUserByIdRepository,
  UserList,
} from '../../../src';
import { ContentFileMock, DirectoryMock, userMock } from '../../entity';
import {
  EditContentFileRepositoryMock,
  FindContentFileByIdRepositoryMock,
  FindDirectoryByIdRespositoryMock,
  FindUserByIdRepositoryMock,
} from '../../repository';

interface SutTypes {
  sut: EditContentFile;
  editContentFileDto: EditContentFileDto;
  findUserByIdRepository: FindUserByIdRepository;
  findDirectoryByIdRepository: FindDirectoryByIdRepository;
  editContentFileRepository: EditContentFileRepository;
  findContentFileByIdRepository: FindContentFileByIdRepository;
}

const makeSut = (): SutTypes => {
  const editContentFileRepository = new EditContentFileRepositoryMock();
  const findUserByIdRepository = new FindUserByIdRepositoryMock();
  const findDirectoryByIdRepository = new FindDirectoryByIdRespositoryMock();
  const findContentFileByIdRepository = new FindContentFileByIdRepositoryMock();
  const editContentFileDto: EditContentFileDto = {
    directoryId: DirectoryMock.id,
    loggedUserId: userMock.userId,
    idToEdit: ContentFileMock.id,
    originalName: 'any_original_name',
  };

  const sut = new EditContentFile(
    editContentFileRepository,
    findUserByIdRepository,
    findDirectoryByIdRepository,
    findContentFileByIdRepository
  );

  return {
    editContentFileRepository,
    findUserByIdRepository,
    findDirectoryByIdRepository,
    findContentFileByIdRepository,
    editContentFileDto,
    sut,
  };
};

describe('EditContentFile', () => {
  it('should return void when a correct content file is edited', async () => {
    const { editContentFileDto, sut } = makeSut();

    const result = await sut.execute(editContentFileDto);
    expect(result.isLeft()).toBe(false);
    expect(result.isRight()).toBe(true);
    expect(result.value).toStrictEqual(undefined);
  });

  it('should return EntityNotEmpty when a pass incorrect logged user id', async () => {
    const { editContentFileDto, sut } = makeSut();
    editContentFileDto.loggedUserId = '';
    const result = await sut.execute(editContentFileDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when a pass incorrect directory id', async () => {
    const { editContentFileDto, sut } = makeSut();
    editContentFileDto.directoryId = '';
    const result = await sut.execute(editContentFileDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when a pass incorrect id to delete', async () => {
    const { editContentFileDto, sut } = makeSut();
    editContentFileDto.idToEdit = '';
    const result = await sut.execute(editContentFileDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when a pass empty file name', async () => {
    const { editContentFileDto, sut } = makeSut();
    editContentFileDto.originalName = '';
    const result = await sut.execute(editContentFileDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotExists if there is no user created in the database', async () => {
    const {
      editContentFileDto,
      findDirectoryByIdRepository,
      findContentFileByIdRepository,
      editContentFileRepository,
    } = makeSut();

    const mockEmptyItem = {} as UserList;

    const mockEmptyRepository: FindUserByIdRepository = {
      find: jest.fn(async () => mockEmptyItem),
    };

    const sut = new EditContentFile(
      editContentFileRepository,
      mockEmptyRepository,
      findDirectoryByIdRepository,
      findContentFileByIdRepository
    );

    const result = await sut.execute(editContentFileDto);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });

  it('should return EntityNotExists if there is no directory created in the database', async () => {
    const {
      editContentFileDto,
      findUserByIdRepository,
      editContentFileRepository,
      findContentFileByIdRepository,
    } = makeSut();

    const mockEmptyItem = {} as Directory;

    const mockEmptyRepository: FindDirectoryByIdRepository = {
      find: jest.fn(async () => mockEmptyItem),
    };

    const sut = new EditContentFile(
      editContentFileRepository,
      findUserByIdRepository,
      mockEmptyRepository,
      findContentFileByIdRepository
    );

    const result = await sut.execute(editContentFileDto);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });

  it('should return EntityNotExists if there is no content file created in the database', async () => {
    const {
      editContentFileDto,
      findUserByIdRepository,
      editContentFileRepository,
      findDirectoryByIdRepository,
    } = makeSut();

    const mockEmptyItem = {} as ContentFile;

    const mockEmptyRepository: FindContentFileByIdRepository = {
      find: jest.fn(async () => mockEmptyItem),
    };

    const sut = new EditContentFile(
      editContentFileRepository,
      findUserByIdRepository,
      findDirectoryByIdRepository,
      mockEmptyRepository
    );

    const result = await sut.execute(editContentFileDto);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });
});
