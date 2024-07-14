import {
  EntityNotEmpty,
  FindFilesByPlaylist,
  FindFilesByPlaylistDto,
  FindFilesByPlaylistRepository,
  FindPlaylistByIdRepository,
  FindUserByIdRepository,
} from '../../../src';
import { ContentFileMock, PlaylistMock, userMock } from '../../entity';
import {
  FindFilesByPlaylistRepositoryMock,
  FindPlaylistByIdRepositoryMock,
  FindUserByIdRepositoryMock,
} from '../../repository';

interface SutTypes {
  sut: FindFilesByPlaylist;
  findFilesByPlaylistDto: FindFilesByPlaylistDto;
  findUserByIdRepository: FindUserByIdRepository;
  findPlaylistByIdRepository: FindPlaylistByIdRepository;
  findFilesByPlaylistRepository: FindFilesByPlaylistRepository;
}

const makeSut = (): SutTypes => {
  const findUserByIdRepository = new FindUserByIdRepositoryMock();
  const findPlaylistByIdRepository = new FindPlaylistByIdRepositoryMock();
  const findFilesByPlaylistRepository = new FindFilesByPlaylistRepositoryMock();

  const findFilesByPlaylistDto: FindFilesByPlaylistDto = {
    idPlaylist: PlaylistMock.id,
    loggedUserId: userMock.userId,
  };

  const sut = new FindFilesByPlaylist(
    findUserByIdRepository,
    findPlaylistByIdRepository,
    findFilesByPlaylistRepository
  );

  return {
    sut,
    findFilesByPlaylistDto,
    findUserByIdRepository,
    findPlaylistByIdRepository,
    findFilesByPlaylistRepository,
  };
};

describe('FindFilesByPlaylist', () => {
  it('should return PlaylistResponseDto when a correct DetailsPlaylistDto', async () => {
    const { findFilesByPlaylistDto, sut } = makeSut();

    const result = await sut.execute(findFilesByPlaylistDto);

    expect(result.isRight()).toBe(true);
    expect(result.isLeft()).toBe(false);
    expect(result.value).toStrictEqual([ContentFileMock]);
  });

  it('should return EntityNotEmpty when a incorrect User ID', async () => {
    const { findFilesByPlaylistDto, sut } = makeSut();
    findFilesByPlaylistDto.loggedUserId = '';
    const result = await sut.execute(findFilesByPlaylistDto);

    expect(result.isRight()).toBe(false);
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when a incorrect playlist ID', async () => {
    const { findFilesByPlaylistDto, sut } = makeSut();
    findFilesByPlaylistDto.idPlaylist = '';
    const result = await sut.execute(findFilesByPlaylistDto);

    expect(result.isRight()).toBe(false);
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });
});
