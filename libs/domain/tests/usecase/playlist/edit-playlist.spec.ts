import {
  EditPlaylist,
  EditPlaylistDto,
  EditPlaylistRepository,
  EntityNotEmpty,
  EntityNotExists,
  FindPlaylistByIdRepository,
  FindPlaylistCategoryByIdRepository,
  FindUserByIdRepository,
  PlaylistBodyDto,
  PlaylistCategory,
  PlaylistResponseDto,
  UserList,
} from '../../../src';
import { PlaylistMock, userMock } from '../../entity';
import {
  EditPlaylistRepositoryMock,
  FindPlaylistByIdRepositoryMock,
  FindPlaylistCategoryByIdRepositoryMock,
  FindUserByIdRepositoryMock,
} from '../../repository';

interface SutTypes {
  sut: EditPlaylist;
  editPlaylistDto: EditPlaylistDto;
  findUserByIdRepository: FindUserByIdRepository;
  findPlaylistByIdRepository: FindPlaylistByIdRepository;
  findPlaylistCategoryByIdRepository: FindPlaylistCategoryByIdRepository;
  editPlaylistRepository: EditPlaylistRepository;
}

const makeSut = (): SutTypes => {
  const findUserByIdRepository = new FindUserByIdRepositoryMock();
  const findPlaylistByIdRepository = new FindPlaylistByIdRepositoryMock();
  const findPlaylistCategoryByIdRepository =
    new FindPlaylistCategoryByIdRepositoryMock();
  const editPlaylistRepository = new EditPlaylistRepositoryMock();

  const editPlaylistDto: EditPlaylistDto = {
    body: {
      name: PlaylistMock.name,
      playlistCategoryId: PlaylistMock.category,
    },
    id: PlaylistMock.id,
    loggedUserId: userMock.userId,
  };

  const sut = new EditPlaylist(
    findUserByIdRepository,
    findPlaylistByIdRepository,
    findPlaylistCategoryByIdRepository,
    editPlaylistRepository
  );

  return {
    findUserByIdRepository,
    findPlaylistByIdRepository,
    findPlaylistCategoryByIdRepository,
    editPlaylistRepository,
    editPlaylistDto,
    sut,
  };
};

describe('EditPlaylist', () => {
  it('should return playlist id when a correct playlist edited in database', async () => {
    const { editPlaylistDto, sut } = makeSut();

    const result = await sut.execute(editPlaylistDto);

    expect(result.isLeft()).toBe(false);
    expect(result.isRight()).toBe(true);
    expect(result.value).toStrictEqual(undefined);
  });

  it('should return EntityNotEmpty when a pass incorrect Logged User ID', async () => {
    const { editPlaylistDto, sut } = makeSut();
    editPlaylistDto.loggedUserId = '';
    const result = await sut.execute(editPlaylistDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when a pass incorrect ID', async () => {
    const { editPlaylistDto, sut } = makeSut();
    editPlaylistDto.id = '';
    const result = await sut.execute(editPlaylistDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when a pass incorrect name', async () => {
    const { editPlaylistDto, sut } = makeSut();
    editPlaylistDto.body.name = '';
    const result = await sut.execute(editPlaylistDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when a pass incorrect Playlist Category ID', async () => {
    const { editPlaylistDto, sut } = makeSut();
    editPlaylistDto.body.playlistCategoryId = '';
    const result = await sut.execute(editPlaylistDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when a pass incorrect body object', async () => {
    const { editPlaylistDto, sut } = makeSut();
    editPlaylistDto.body = {} as PlaylistBodyDto;
    const result = await sut.execute(editPlaylistDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotExists if there is no user created in the database', async () => {
    const {
      editPlaylistDto,
      findPlaylistByIdRepository,
      findPlaylistCategoryByIdRepository,
      editPlaylistRepository,
    } = makeSut();

    const mockEmptyItem = {} as UserList;

    const mockEmptyRepository: FindUserByIdRepository = {
      find: jest.fn(async () => mockEmptyItem),
    };

    const sut = new EditPlaylist(
      mockEmptyRepository,
      findPlaylistByIdRepository,
      findPlaylistCategoryByIdRepository,
      editPlaylistRepository
    );

    const result = await sut.execute(editPlaylistDto);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });

  it('should return EntityNotExists if there is no playlist created in the database', async () => {
    const {
      editPlaylistDto,
      findUserByIdRepository,
      editPlaylistRepository,
      findPlaylistCategoryByIdRepository,
    } = makeSut();

    const mockEmptyItem = {} as PlaylistResponseDto;

    const mockEmptyRepository: FindPlaylistByIdRepository = {
      find: jest.fn(async () => mockEmptyItem),
    };

    const sut = new EditPlaylist(
      findUserByIdRepository,
      mockEmptyRepository,
      findPlaylistCategoryByIdRepository,
      editPlaylistRepository
    );

    const result = await sut.execute(editPlaylistDto);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });

  it('should return EntityNotExists if there is no playlist category created in the database', async () => {
    const {
      editPlaylistDto,
      findUserByIdRepository,
      findPlaylistByIdRepository,
      editPlaylistRepository,
    } = makeSut();

    const mockEmptyItem = {} as PlaylistCategory;

    const mockEmptyRepository: FindPlaylistCategoryByIdRepository = {
      find: jest.fn(async () => mockEmptyItem),
    };

    const sut = new EditPlaylist(
      findUserByIdRepository,
      findPlaylistByIdRepository,
      mockEmptyRepository,
      editPlaylistRepository
    );

    const result = await sut.execute(editPlaylistDto);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });
});
