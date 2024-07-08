import {
  CreatePlaylist,
  CreatePlaylistDto,
  CreatePlaylistRepository,
  EntityAlreadyExists,
  EntityNotCreated,
  EntityNotEmpty,
  FindPlaylistByNameRepository,
  FindUserByIdRepository,
} from '../../../src';
import { PlaylistCategoryMock, PlaylistMock, userMock } from '../../entity';
import {
  CreatePlaylistRepositoryMock,
  FindPlaylistByNameRepositoryMock,
  FindUserByIdRepositoryMock,
} from '../../repository';
interface SutTypes {
  sut: CreatePlaylist;
  createPlaylistDto: CreatePlaylistDto;
  findUserByIdRepository: FindUserByIdRepository;
  findPlaylistByNameRepository: FindPlaylistByNameRepository;
  createPlaylistRepository: CreatePlaylistRepository;
}

const makeSut = (): SutTypes => {
  const findUserByIdRepository = new FindUserByIdRepositoryMock();
  const findPlaylistByNameRepository = new FindPlaylistByNameRepositoryMock();
  const createPlaylistRepository = new CreatePlaylistRepositoryMock();

  const createPlaylistDto: CreatePlaylistDto = {
    loggedUserId: userMock.userId,
    name: PlaylistMock.name,
    playlistCategoryId: PlaylistCategoryMock.id,
  };

  const sut = new CreatePlaylist(
    findUserByIdRepository,
    findPlaylistByNameRepository,
    createPlaylistRepository
  );

  return {
    findUserByIdRepository,
    findPlaylistByNameRepository,
    createPlaylistRepository,
    createPlaylistDto,
    sut,
  };
};

describe('CreatePlaylist', () => {
  it('should return playlist id when a correct playlist created in database', async () => {
    const { sut, createPlaylistDto } = makeSut();

    const result = await sut.execute(createPlaylistDto);

    expect(result.isLeft()).toBe(false);
    expect(result.isRight()).toBe(true);
    expect(result.value).toStrictEqual(PlaylistMock.id);
  });

  it('should return EntityNotEmpty when a pass incorrect Logged User ID', async () => {
    const { createPlaylistDto, sut } = makeSut();
    createPlaylistDto.loggedUserId = '';
    const result = await sut.execute(createPlaylistDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when a pass incorrect name', async () => {
    const { createPlaylistDto, sut } = makeSut();
    createPlaylistDto.name = '';
    const result = await sut.execute(createPlaylistDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when a pass incorrect Playlist Category ID', async () => {
    const { createPlaylistDto, sut } = makeSut();
    createPlaylistDto.playlistCategoryId = '';
    const result = await sut.execute(createPlaylistDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityAlreadyExists if there is no user created in the database', async () => {
    const {
      createPlaylistDto,
      findUserByIdRepository,
      createPlaylistRepository,
    } = makeSut();

    const mockEmptyRepository: FindPlaylistByNameRepository = {
      find: jest.fn(async () => PlaylistMock),
    };

    const sut = new CreatePlaylist(
      findUserByIdRepository,
      mockEmptyRepository,
      createPlaylistRepository
    );

    const result = await sut.execute(createPlaylistDto);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityAlreadyExists);
  });

  it('should return EntityNotCreated if there is no user created in the database', async () => {
    const {
      createPlaylistDto,
      findUserByIdRepository,
      findPlaylistByNameRepository,
    } = makeSut();

    const mockEmptyRepository: CreatePlaylistRepository = {
      create: jest.fn(async () => ''),
    };

    const sut = new CreatePlaylist(
      findUserByIdRepository,
      findPlaylistByNameRepository,
      mockEmptyRepository
    );

    const result = await sut.execute(createPlaylistDto);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotCreated);
  });
});
