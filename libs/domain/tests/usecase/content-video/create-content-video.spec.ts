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
} from '../../../src';
import { ContentVideoMock, DirectoryMock, userMock } from '../../entity';
import {
  CreateContentVideoRepositoryMock,
  FindDirectoryByIdRespositoryMock,
  FindUserByIdRepositoryMock,
} from '../../repository';

interface SutTypes {
  sut: CreateContentVideo;
  createContentVideoDto: CreateContentVideoDto;
  findUserByIdRepository: FindUserByIdRepository;
  findDirectoryByIdRepository: FindDirectoryByIdRepository;
  createContentVideoRepository: CreateContentVideoRepository;
}

const makeSut = (): SutTypes => {
  const createContentVideoRepository = new CreateContentVideoRepositoryMock();
  const findUserByIdRepository = new FindUserByIdRepositoryMock();
  const findDirectoryByIdRepository = new FindDirectoryByIdRespositoryMock();

  const createContentVideoDto: CreateContentVideoDto = {
    directoryId: DirectoryMock.id,
    loggedUserId: userMock.userId,
    duration: 'any_duration',
    format: 'any_format',
    name: 'any_name',
    resolution: 'any_resolution',
    size: 'any_size',
  };

  const sut = new CreateContentVideo(
    createContentVideoRepository,
    findUserByIdRepository,
    findDirectoryByIdRepository
  );

  return {
    createContentVideoRepository,
    findUserByIdRepository,
    findDirectoryByIdRepository,
    createContentVideoDto,
    sut,
  };
};

describe('CreateContentVideo', () => {
  it('should return void when a correct content video is created', async () => {
    const { createContentVideoDto, sut } = makeSut();

    const result = await sut.execute(createContentVideoDto);

    expect(result.isLeft()).toBe(false);
    expect(result.isRight()).toBe(true);
    expect(result.value).toBe(ContentVideoMock.id);
  });

  it('should return EntityNotEmpty when a pass incorrect logged user id', async () => {
    const { createContentVideoDto, sut } = makeSut();
    createContentVideoDto.loggedUserId = '';
    const result = await sut.execute(createContentVideoDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when a pass incorrect directory id', async () => {
    const { createContentVideoDto, sut } = makeSut();
    createContentVideoDto.directoryId = '';
    const result = await sut.execute(createContentVideoDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when a pass incorrect name', async () => {
    const { createContentVideoDto, sut } = makeSut();
    createContentVideoDto.name = '';
    const result = await sut.execute(createContentVideoDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when a pass incorrect duration', async () => {
    const { createContentVideoDto, sut } = makeSut();
    createContentVideoDto.duration = '';
    const result = await sut.execute(createContentVideoDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when a pass incorrect format', async () => {
    const { createContentVideoDto, sut } = makeSut();
    createContentVideoDto.format = '';
    const result = await sut.execute(createContentVideoDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when a pass incorrect resolution', async () => {
    const { createContentVideoDto, sut } = makeSut();
    createContentVideoDto.resolution = '';
    const result = await sut.execute(createContentVideoDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when a pass incorrect size', async () => {
    const { createContentVideoDto, sut } = makeSut();
    createContentVideoDto.size = '';
    const result = await sut.execute(createContentVideoDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotExists if there is no user created in the database', async () => {
    const {
      createContentVideoDto,
      findDirectoryByIdRepository,
      createContentVideoRepository,
    } = makeSut();

    const mockEmptyItem = {} as UserList;

    const mockEmptyRepository: FindUserByIdRepository = {
      find: jest.fn(async () => mockEmptyItem),
    };

    const sut = new CreateContentVideo(
      createContentVideoRepository,
      mockEmptyRepository,
      findDirectoryByIdRepository
    );

    const result = await sut.execute(createContentVideoDto);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });

  it('should return EntityNotExists if there is no directory created in the database', async () => {
    const {
      createContentVideoDto,
      findUserByIdRepository,
      createContentVideoRepository,
    } = makeSut();

    const mockEmptyItem = {} as Directory;

    const mockEmptyRepository: FindDirectoryByIdRepository = {
      find: jest.fn(async () => mockEmptyItem),
    };

    const sut = new CreateContentVideo(
      createContentVideoRepository,
      findUserByIdRepository,
      mockEmptyRepository
    );

    const result = await sut.execute(createContentVideoDto);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });

  it('should return EntityNotCreated if there is no content video created in the database', async () => {
    const {
      findDirectoryByIdRepository,
      findUserByIdRepository,
      createContentVideoDto,
    } = makeSut();

    const mockEmptyItem = {} as Directory;

    const mockEmptyRepository: CreateContentVideoRepository = {
      create: jest.fn(async () => ''),
    };

    const sut = new CreateContentVideo(
      mockEmptyRepository,
      findUserByIdRepository,
      findDirectoryByIdRepository
    );

    const result = await sut.execute(createContentVideoDto);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotCreated);
  });
});
