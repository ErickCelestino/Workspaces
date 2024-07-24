import {
  AddPlaylistsToScheduling,
  AddPlaylistsToSchedulingDto,
  AddPlaylistToSchedulingRepository,
  EntityNotCreated,
  EntityNotEmpty,
  FindPlaylistByIdRepository,
  FindPlaylistToSchedulingByIdsRepository,
  FindSchedulingByIdRepository,
  FindUserByIdRepository,
} from '../../../src';
import {
  PlaylistMock,
  PlaylistToSchedulingMock,
  SchedulingMock,
  userMock,
} from '../../entity';
import {
  AddPlaylistsToSchedulingRepositoryMock,
  FindPlaylistByIdRepositoryMock,
  FindPlaylistToSchedulingByIdsRepositoryMock,
  FindSchedulingByIdRepositoryMock,
  FindUserByIdRepositoryMock,
} from '../../repository';

interface SutTypes {
  sut: AddPlaylistsToScheduling;
  addPlaylisttToSchedulingDto: AddPlaylistsToSchedulingDto;
  findUserByIdRepository: FindUserByIdRepository;
  findSchedulingByIdRepository: FindSchedulingByIdRepository;
  findPlaylistByIdRepository: FindPlaylistByIdRepository;
  findPlaylistToSchedulingByIdsRepository: FindPlaylistToSchedulingByIdsRepository;
  addPlaylistsToSchedulingRepository: AddPlaylistToSchedulingRepository;
}

const makeSut = (): SutTypes => {
  const findUserByIdRepository = new FindUserByIdRepositoryMock();
  const findSchedulingByIdRepository = new FindSchedulingByIdRepositoryMock();
  const findPlaylistByIdRepository = new FindPlaylistByIdRepositoryMock();
  const findPlaylistToSchedulingByIdsRepository =
    new FindPlaylistToSchedulingByIdsRepositoryMock();
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
    findPlaylistToSchedulingByIdsRepository,
    addPlaylistsToSchedulingRepository
  );

  return {
    sut,
    addPlaylisttToSchedulingDto,
    findUserByIdRepository,
    findSchedulingByIdRepository,
    findPlaylistByIdRepository,
    findPlaylistToSchedulingByIdsRepository,
    addPlaylistsToSchedulingRepository,
  };
};

describe('AddPlaylistsToScheduling', () => {
  it('should return list id when pass correct AddPlaylistsToSchedulingDto', async () => {
    const { sut, addPlaylisttToSchedulingDto } = makeSut();

    const result = await sut.execute(addPlaylisttToSchedulingDto);

    expect(result.isRight()).toBe(true);
    expect(result.isLeft()).toBe(false);
    expect(result.value).toStrictEqual([PlaylistToSchedulingMock.id]);
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
      findPlaylistToSchedulingByIdsRepository,
      addPlaylisttToSchedulingDto,
    } = makeSut();

    const mockEmptyRepository: AddPlaylistToSchedulingRepository = {
      add: jest.fn(async () => ''),
    };

    const sut = new AddPlaylistsToScheduling(
      findUserByIdRepository,
      findSchedulingByIdRepository,
      findPlaylistByIdRepository,
      findPlaylistToSchedulingByIdsRepository,
      mockEmptyRepository
    );

    const result = await sut.execute(addPlaylisttToSchedulingDto);

    expect(result.isRight()).toBe(false);
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotCreated);
  });
});
