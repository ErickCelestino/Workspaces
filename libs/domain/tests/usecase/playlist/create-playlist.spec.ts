import {
  CreatePlaylist,
  CreatePlaylistDto,
  CreatePlaylistRepository,
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
  it('', async () => {
    const { sut, createPlaylistDto } = makeSut();

    const result = await sut.execute(createPlaylistDto);

    expect(result.isLeft()).toBe(false);
    expect(result.isRight()).toBe(true);
    expect(result.value).toStrictEqual(PlaylistMock.id);
  });
});
