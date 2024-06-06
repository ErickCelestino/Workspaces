import {
  CreateContentVideoDto,
  CreateContentVideo,
  FindUserByIdRepository,
  CreateContentVideoRepository,
  FindDirectoryByIdRepository,
  EntityNotEmpty,
  UserList,
  EntityNotExists,
  Directory,
  EntityNotCreated,
  UploadedFile,
} from '../../../src';
import { ContentFileMock, DirectoryMock, userMock } from '../../entity';
import {
  CreateContentVideoRepositoryMock,
  FindDirectoryByIdRespositoryMock,
  FindUserByIdRepositoryMock,
} from '../../repository';

interface SutTypes {
  sut: CreateContentVideo;
  CreateContentVideoDto: CreateContentVideoDto;
  findUserByIdRepository: FindUserByIdRepository;
  findDirectoryByIdRepository: FindDirectoryByIdRepository;
  CreateContentVideoRepository: CreateContentVideoRepository;
}

const makeSut = (): SutTypes => {
  const CreateContentVideoRepository = new CreateContentVideoRepositoryMock();
  const findUserByIdRepository = new FindUserByIdRepositoryMock();
  const findDirectoryByIdRepository = new FindDirectoryByIdRespositoryMock();
  const mockBuffer = {} as Buffer;
  const CreateContentVideoDto: CreateContentVideoDto = {
    directoryId: DirectoryMock.id,
    loggedUserId: userMock.userId,
    file: [
      {
        fieldname: 'any_fieldname',
        originalname: 'any_originalname',
        encoding: 'any_encoding',
        mimetype: 'mimetype',
        buffer: mockBuffer,
        size: 1,
      },
    ],
  };

  const sut = new CreateContentVideo(
    CreateContentVideoRepository,
    findUserByIdRepository,
    findDirectoryByIdRepository
  );

  return {
    CreateContentVideoRepository,
    findUserByIdRepository,
    findDirectoryByIdRepository,
    CreateContentVideoDto,
    sut,
  };
};

describe('CreateContentVideo', () => {
  it('should return void when a correct content video is created', async () => {
    const { CreateContentVideoDto, sut } = makeSut();

    const result = await sut.execute(CreateContentVideoDto);
    const resultResponse = [ContentFileMock.id];
    expect(result.isLeft()).toBe(false);
    expect(result.isRight()).toBe(true);
    expect(result.value).toStrictEqual(resultResponse);
  });

  it('should return EntityNotEmpty when a pass incorrect logged user id', async () => {
    const { CreateContentVideoDto, sut } = makeSut();
    CreateContentVideoDto.loggedUserId = '';
    const result = await sut.execute(CreateContentVideoDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when a pass incorrect directory id', async () => {
    const { CreateContentVideoDto, sut } = makeSut();
    CreateContentVideoDto.directoryId = '';
    const result = await sut.execute(CreateContentVideoDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when a pass incorrect file', async () => {
    const { CreateContentVideoDto, sut } = makeSut();
    const arrayEmpty = {} as UploadedFile;
    for (let i = 0; i < CreateContentVideoDto.file.length; i++) {
      CreateContentVideoDto.file[i] = arrayEmpty;
    }
    const result = await sut.execute(CreateContentVideoDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotExists if there is no user created in the database', async () => {
    const {
      CreateContentVideoDto,
      findDirectoryByIdRepository,
      CreateContentVideoRepository,
    } = makeSut();

    const mockEmptyItem = {} as UserList;

    const mockEmptyRepository: FindUserByIdRepository = {
      find: jest.fn(async () => mockEmptyItem),
    };

    const sut = new CreateContentVideo(
      CreateContentVideoRepository,
      mockEmptyRepository,
      findDirectoryByIdRepository
    );

    const result = await sut.execute(CreateContentVideoDto);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });

  it('should return EntityNotExists if there is no directory created in the database', async () => {
    const {
      CreateContentVideoDto,
      findUserByIdRepository,
      CreateContentVideoRepository,
    } = makeSut();

    const mockEmptyItem = {} as Directory;

    const mockEmptyRepository: FindDirectoryByIdRepository = {
      find: jest.fn(async () => mockEmptyItem),
    };

    const sut = new CreateContentVideo(
      CreateContentVideoRepository,
      findUserByIdRepository,
      mockEmptyRepository
    );

    const result = await sut.execute(CreateContentVideoDto);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });

  it('should return EntityNotCreated if there is no content video created in the database', async () => {
    const {
      findDirectoryByIdRepository,
      findUserByIdRepository,
      CreateContentVideoDto,
    } = makeSut();

    const mockEmptyItem = {} as Directory;

    const mockEmptyRepository: CreateContentVideoRepository = {
      create: jest.fn(async () => []),
    };

    const sut = new CreateContentVideo(
      mockEmptyRepository,
      findUserByIdRepository,
      findDirectoryByIdRepository
    );

    const result = await sut.execute(CreateContentVideoDto);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotCreated);
  });
});
