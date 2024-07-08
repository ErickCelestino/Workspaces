import {
  AddFileToPlaylist,
  AddFileToPlaylistDto,
  AddFileToPlaylistRepository,
  EntityNotCreated,
  EntityNotEmpty,
  FindContentFileByIdRepository,
  FindPlaylistByIdRepository,
  FindUserByIdRepository,
} from '../../../../src';
import {
  ContentFileMock,
  FileToPlaylistMock,
  PlaylistMock,
  userMock,
} from '../../../entity';
import {
  AddFileToPlaylistRepositoryMock,
  FindContentFileByIdRepositoryMock,
  FindPlaylistByIdRepositoryMock,
  FindUserByIdRepositoryMock,
} from '../../../repository';

interface SutTypes {
  sut: AddFileToPlaylist;
  addtFileToPlaylistDto: AddFileToPlaylistDto;
  findUserByIdRepository: FindUserByIdRepository;
  findContentFileByIdRepository: FindContentFileByIdRepository;
  findPlaylistByIdRepository: FindPlaylistByIdRepository;
  addFileToPlaylistRepository: AddFileToPlaylistRepository;
}

const makeSut = (): SutTypes => {
  const findUserByIdRepository = new FindUserByIdRepositoryMock();
  const findContentFileByIdRepository = new FindContentFileByIdRepositoryMock();
  const findPlaylistByIdRepository = new FindPlaylistByIdRepositoryMock();
  const addFileToPlaylistRepository = new AddFileToPlaylistRepositoryMock();

  const addtFileToPlaylistDto: AddFileToPlaylistDto = {
    filesId: [ContentFileMock.id],
    loggedUserId: userMock.userId,
    playlistId: PlaylistMock.id,
  };

  const sut = new AddFileToPlaylist(
    findUserByIdRepository,
    findContentFileByIdRepository,
    findPlaylistByIdRepository,
    addFileToPlaylistRepository
  );

  return {
    findUserByIdRepository,
    findContentFileByIdRepository,
    findPlaylistByIdRepository,
    addFileToPlaylistRepository,
    addtFileToPlaylistDto,
    sut,
  };
};

describe('AddFileToPlaylist', () => {
  it('should return file to playlist id when a correct add file to playlist dto', async () => {
    const { sut, addtFileToPlaylistDto } = makeSut();

    const result = await sut.execute(addtFileToPlaylistDto);

    expect(result.isLeft()).toBe(false);
    expect(result.isRight()).toBe(true);
    expect(result.value).toStrictEqual([FileToPlaylistMock.id]);
  });

  it('should return EntityNotEmpty when a pass incorrect file id', async () => {
    const { sut, addtFileToPlaylistDto } = makeSut();
    addtFileToPlaylistDto.filesId[0] = '';
    const result = await sut.execute(addtFileToPlaylistDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when a pass incorrect logged user id', async () => {
    const { sut, addtFileToPlaylistDto } = makeSut();
    addtFileToPlaylistDto.loggedUserId = '';
    const result = await sut.execute(addtFileToPlaylistDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when a pass incorrect logged playlist id', async () => {
    const { sut, addtFileToPlaylistDto } = makeSut();
    addtFileToPlaylistDto.playlistId = '';
    const result = await sut.execute(addtFileToPlaylistDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotCreated if there is no file to playlist created in the database', async () => {
    const {
      findContentFileByIdRepository,
      findUserByIdRepository,
      addtFileToPlaylistDto,
      findPlaylistByIdRepository,
    } = makeSut();

    const mockEmptyRepository: AddFileToPlaylistRepository = {
      add: jest.fn(async () => []),
    };

    const sut = new AddFileToPlaylist(
      findUserByIdRepository,
      findContentFileByIdRepository,
      findPlaylistByIdRepository,
      mockEmptyRepository
    );

    const result = await sut.execute(addtFileToPlaylistDto);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotCreated);
  });
});
