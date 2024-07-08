import {
  CreateContentFileDto,
  CreateContentFile,
  FindUserByIdRepository,
  CreateContentFileRepository,
  FindDirectoryByIdRepository,
  EntityNotEmpty,
  UserList,
  EntityNotExists,
  Directory,
  EntityNotCreated,
  FileNotAllowed,
  FindUrlFileRepository,
} from '../../../src';
import { ContentFileMock, DirectoryMock, userMock } from '../../entity';
import {
  CreateContentFileRepositoryMock,
  FindDirectoryByIdRespositoryMock,
  FindUrlFileRepositoryMock,
  FindUserByIdRepositoryMock,
} from '../../repository';

interface SutTypes {
  sut: CreateContentFile;
  CreateContentFileDto: CreateContentFileDto;
  findUserByIdRepository: FindUserByIdRepository;
  findDirectoryByIdRepository: FindDirectoryByIdRepository;
  CreateContentFileRepository: CreateContentFileRepository;
  findUrlFileRespository: FindUrlFileRepository;
}

const makeSut = (): SutTypes => {
  const CreateContentFileRepository = new CreateContentFileRepositoryMock();
  const findUserByIdRepository = new FindUserByIdRepositoryMock();
  const findDirectoryByIdRepository = new FindDirectoryByIdRespositoryMock();
  const findUrlFileRespository = new FindUrlFileRepositoryMock();
  const mockBuffer = {} as Buffer;
  const CreateContentFileDto: CreateContentFileDto = {
    directoryId: DirectoryMock.id,
    loggedUserId: userMock.userId,
    file: [
      {
        fieldname: 'any_fieldname',
        originalname: 'any_originalname',
        encoding: 'any_encoding',
        mimetype: 'image/png',
        buffer: mockBuffer,
        size: 1,
        filename: 'any_filename',
        path: 'any_path',
      },
    ],
  };

  const sut = new CreateContentFile(
    CreateContentFileRepository,
    findUserByIdRepository,
    findDirectoryByIdRepository,
    findUrlFileRespository
  );

  return {
    CreateContentFileRepository,
    findUserByIdRepository,
    findDirectoryByIdRepository,
    findUrlFileRespository,
    CreateContentFileDto,
    sut,
  };
};

describe('CreateContentFile', () => {
  it('should return void when a correct content video is created', async () => {
    const { CreateContentFileDto, sut } = makeSut();

    const result = await sut.execute(CreateContentFileDto);
    const resultResponse = [ContentFileMock.id];
    expect(result.isLeft()).toBe(false);
    expect(result.isRight()).toBe(true);
    expect(result.value).toStrictEqual(resultResponse);
  });

  it('should return EntityNotEmpty when a pass incorrect logged user id', async () => {
    const { CreateContentFileDto, sut } = makeSut();
    CreateContentFileDto.loggedUserId = '';
    const result = await sut.execute(CreateContentFileDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when a pass incorrect directory id', async () => {
    const { CreateContentFileDto, sut } = makeSut();
    CreateContentFileDto.directoryId = '';
    const result = await sut.execute(CreateContentFileDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when a pass incorrect file', async () => {
    const { CreateContentFileDto, sut } = makeSut();
    CreateContentFileDto.file = [];
    const result = await sut.execute(CreateContentFileDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotExists if there is no directory created in the database', async () => {
    const {
      CreateContentFileDto,
      findUserByIdRepository,
      CreateContentFileRepository,
      findUrlFileRespository,
    } = makeSut();

    const mockEmptyItem = {} as Directory;

    const mockEmptyRepository: FindDirectoryByIdRepository = {
      find: jest.fn(async () => mockEmptyItem),
    };

    const sut = new CreateContentFile(
      CreateContentFileRepository,
      findUserByIdRepository,
      mockEmptyRepository,
      findUrlFileRespository
    );

    const result = await sut.execute(CreateContentFileDto);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });

  it('should return EntityNotCreated if there is no content video created in the database', async () => {
    const {
      findDirectoryByIdRepository,
      findUserByIdRepository,
      CreateContentFileDto,
      findUrlFileRespository,
    } = makeSut();

    const mockEmptyRepository: CreateContentFileRepository = {
      create: jest.fn(async () => ''),
    };

    const sut = new CreateContentFile(
      mockEmptyRepository,
      findUserByIdRepository,
      findDirectoryByIdRepository,
      findUrlFileRespository
    );

    const result = await sut.execute(CreateContentFileDto);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotCreated);
  });

  it('should return FileNotAllowed when a pass incorrect file', async () => {
    const { CreateContentFileDto, sut } = makeSut();
    CreateContentFileDto.file[0].mimetype = '';
    const result = await sut.execute(CreateContentFileDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(FileNotAllowed);
  });
});
