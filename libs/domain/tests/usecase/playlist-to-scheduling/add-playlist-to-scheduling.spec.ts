import {
  AddPlaylistsToScheduling,
  AddPlaylistsToSchedulingDto,
  AddPlaylistToSchedulingRepository,
  EntityNotCreated,
  EntityNotEmpty,
  FindPlaylistByIdRepository,
  FindSchedulingByIdRepository,
  FindUserById,
  FindUserByIdRepository,
} from '../../../src';
import { PlaylistMock, SchedulingMock, userMock } from '../../entity';
import {
  AddPlaylistsToSchedulingRepositoryMock,
  FindPlaylistByIdRepositoryMock,
  FindSchedulingByIdRepositoryMock,
  FindUserByIdRepositoryMock,
} from '../../repository';

interface SutTypes {
  sut: AddPlaylistsToScheduling;
  addPlaylisttToSchedulingDto: AddPlaylistsToSchedulingDto;
  findUserByIdRepository: FindUserByIdRepository;
  findSchedulingByIdRepository: FindSchedulingByIdRepository;
  findPlaylistByIdRepository: FindPlaylistByIdRepository;
  addPlaylistsToSchedulingRepository: AddPlaylistToSchedulingRepository;
}

const makeSut = (): SutTypes => {
  const findUserByIdRepository = new FindUserByIdRepositoryMock();
  const findSchedulingByIdRepository = new FindSchedulingByIdRepositoryMock();
  const findPlaylistByIdRepository = new FindPlaylistByIdRepositoryMock();
  const addPlaylistsToSchedulingRepository =
    new AddPlaylistsToSchedulingRepositoryMock();

  const addPlaylisttToSchedulingDto: AddPlaylistsToSchedulingDto = {
    loggedUserId: userMock.userId,
    schedulingId: SchedulingMock.id,
    playlistIds: [PlaylistMock.id],
  };

  const sut = new AddPlaylistsToScheduling(
    findUserByIdRepository,
    findSchedulingByIdRepository,
    findPlaylistByIdRepository,
    addPlaylistsToSchedulingRepository
  );

  return {
    sut,
    addPlaylisttToSchedulingDto,
    findUserByIdRepository,
    findSchedulingByIdRepository,
    findPlaylistByIdRepository,
    addPlaylistsToSchedulingRepository,
  };
};

describe('AddPlaylistsToScheduling', () => {
  it('should return list id when pass correct AddPlaylistsToSchedulingDto', async () => {
    const { sut, addPlaylisttToSchedulingDto } = makeSut();

    const result = await sut.execute(addPlaylisttToSchedulingDto);

    expect(result.isRight()).toBe(true);
    expect(result.isLeft()).toBe(false);
    expect(result.value).toStrictEqual([
      `${PlaylistMock.id}-${SchedulingMock.id}`,
    ]);
  });

  it('should return EntityNotEmpty when pass incorrect User ID', async () => {
    const { sut, addPlaylisttToSchedulingDto } = makeSut();
    addPlaylisttToSchedulingDto.loggedUserId = '';
    const result = await sut.execute(addPlaylisttToSchedulingDto);

    expect(result.isRight()).toBe(false);
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when pass incorrect Scheduling ID', async () => {
    const { sut, addPlaylisttToSchedulingDto } = makeSut();
    addPlaylisttToSchedulingDto.schedulingId = '';
    const result = await sut.execute(addPlaylisttToSchedulingDto);

    expect(result.isRight()).toBe(false);
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when pass incorrect Playlist IDs', async () => {
    const { sut, addPlaylisttToSchedulingDto } = makeSut();
    addPlaylisttToSchedulingDto.playlistIds = [];
    const result = await sut.execute(addPlaylisttToSchedulingDto);

    expect(result.isRight()).toBe(false);
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when pass incorrect Playlist ID', async () => {
    const { sut, addPlaylisttToSchedulingDto } = makeSut();
    addPlaylisttToSchedulingDto.playlistIds[0] = '';
    const result = await sut.execute(addPlaylisttToSchedulingDto);

    expect(result.isRight()).toBe(false);
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityAlreadyExists when a exist scheduling in database', async () => {
    const {
      findUserByIdRepository,
      findPlaylistByIdRepository,
      findSchedulingByIdRepository,
      addPlaylisttToSchedulingDto,
    } = makeSut();

    const mockEmptyRepository: AddPlaylistToSchedulingRepository = {
      add: jest.fn(async () => ''),
    };

    const sut = new AddPlaylistsToScheduling(
      findUserByIdRepository,
      findSchedulingByIdRepository,
      findPlaylistByIdRepository,
      mockEmptyRepository
    );

    const result = await sut.execute(addPlaylisttToSchedulingDto);

    expect(result.isRight()).toBe(false);
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotCreated);
  });
});
