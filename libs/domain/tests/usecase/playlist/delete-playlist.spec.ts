import {
  DeletePlaylist,
  DeletePlaylistDto,
  DeletePlaylistRepoistory,
  EntityNotEmpty,
  EntityNotExists,
  FindPlaylistByIdRepository,
  FindUserByIdRepository,
  PlaylistResponseDto,
  UserList,
} from '../../../src';
import { PlaylistMock, userMock } from '../../entity';
import {
  DeletePlaylistRepositoryMock,
  FindPlaylistByIdRepositoryMock,
  FindUserByIdRepositoryMock,
} from '../../repository';

interface SutTypes {
  sut: DeletePlaylist;
  deletePlaylistDto: DeletePlaylistDto;
  findUserByIdRepository: FindUserByIdRepository;
  findPlaylistByIdRepository: FindPlaylistByIdRepository;
  deletePlaylistRepository: DeletePlaylistRepoistory;
}

const makeSut = (): SutTypes => {
  const findUserByIdRepository = new FindUserByIdRepositoryMock();
  const findPlaylistByIdRepository = new FindPlaylistByIdRepositoryMock();
  const deletePlaylistRepository = new DeletePlaylistRepositoryMock();

  const deletePlaylistDto: DeletePlaylistDto = {
    id: PlaylistMock.id,
    loggedUserId: userMock.userId,
  };

  const sut = new DeletePlaylist(
    findUserByIdRepository,
    findPlaylistByIdRepository,
    deletePlaylistRepository
  );

  return {
    findUserByIdRepository,
    findPlaylistByIdRepository,
    deletePlaylistRepository,
    deletePlaylistDto,
    sut,
  };
};

describe('DeletePlaylist', () => {
  it('should return void when a correct playlist deleted in database', async () => {
    const { sut, deletePlaylistDto } = makeSut();

    const result = await sut.execute(deletePlaylistDto);

    expect(result.isLeft()).toBe(false);
    expect(result.isRight()).toBe(true);
    expect(result.value).toStrictEqual(undefined);
  });

  it('should return EntityNotEmpty when a pass incorrect Logged User ID', async () => {
    const { deletePlaylistDto, sut } = makeSut();
    deletePlaylistDto.loggedUserId = '';
    const result = await sut.execute(deletePlaylistDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when a pass incorrect ID', async () => {
    const { deletePlaylistDto, sut } = makeSut();
    deletePlaylistDto.id = '';
    const result = await sut.execute(deletePlaylistDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when a pass incorrect Logged User ID', async () => {
    const { deletePlaylistDto, sut } = makeSut();
    deletePlaylistDto.loggedUserId = '';
    const result = await sut.execute(deletePlaylistDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotExists if there is no user created in the database', async () => {
    const {
      deletePlaylistDto,
      findPlaylistByIdRepository,
      deletePlaylistRepository,
    } = makeSut();

    const mockEmptyItem = {} as UserList;

    const mockEmptyRepository: FindUserByIdRepository = {
      find: jest.fn(async () => mockEmptyItem),
    };

    const sut = new DeletePlaylist(
      mockEmptyRepository,
      findPlaylistByIdRepository,
      deletePlaylistRepository
    );

    const result = await sut.execute(deletePlaylistDto);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });

  it('should return EntityNotExists if there is no playlist created in the database', async () => {
    const {
      deletePlaylistDto,
      findUserByIdRepository,
      deletePlaylistRepository,
    } = makeSut();

    const mockEmptyItem = {} as PlaylistResponseDto;

    const mockEmptyRepository: FindPlaylistByIdRepository = {
      find: jest.fn(async () => mockEmptyItem),
    };

    const sut = new DeletePlaylist(
      findUserByIdRepository,
      mockEmptyRepository,
      deletePlaylistRepository
    );

    const result = await sut.execute(deletePlaylistDto);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });
});
