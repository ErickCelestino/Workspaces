import {
  EntityNotEmpty,
  EntityNotExists,
  FindUserByIdRepository,
  ListPlaylist,
  ListPlaylistDto,
  ListPlaylistRepository,
  UserList,
} from '../../../src';
import { ListPlaylistResponseMock, userMock } from '../../entity';
import {
  FindUserByIdRepositoryMock,
  ListPlaylistRepositoryMock,
} from '../../repository';

interface SutTypes {
  sut: ListPlaylist;
  listPlaylistDto: ListPlaylistDto;
  findUserByIdRepository: FindUserByIdRepository;
  listPlaylistRepository: ListPlaylistRepository;
}

const makeSut = (): SutTypes => {
  const findUserByIdRepository = new FindUserByIdRepositoryMock();
  const listPlaylistRepository = new ListPlaylistRepositoryMock();

  const listPlaylistDto: ListPlaylistDto = {
    loggedUserId: userMock.userId,
    userInput: '',
  };

  const sut = new ListPlaylist(findUserByIdRepository, listPlaylistRepository);

  return {
    findUserByIdRepository,
    listPlaylistRepository,
    listPlaylistDto,
    sut,
  };
};

describe('ListPlaylist', () => {
  it('should return playlist list when a correct input data', async () => {
    const { sut, listPlaylistDto } = makeSut();

    const result = await sut.execute(listPlaylistDto);

    expect(result.isLeft()).toBe(false);
    expect(result.isRight()).toBe(true);
    expect(result.value).toStrictEqual(ListPlaylistResponseMock);
  });

  it('should return EntityNotEmpty when a pass incorrect Logged User ID', async () => {
    const { listPlaylistDto, sut } = makeSut();
    listPlaylistDto.loggedUserId = '';
    const result = await sut.execute(listPlaylistDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotExists when a pass incorrect Logged User ID', async () => {
    const { listPlaylistDto, sut } = makeSut();
    jest
      .spyOn(sut['findUserByIdRepository'], 'find')
      .mockResolvedValueOnce({} as UserList);
    const result = await sut.execute(listPlaylistDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });
});
