import {
  EntityNotAssociate,
  EntityNotEmpty,
  FindContentFileByIdRepository,
  FindFileInFileToPlaylistRepository,
  FindPlaylistByIdRepository,
  FindUserByIdRepository,
  MoveFilesToAnotherPlaylist,
  MoveFilesToAnotherPlaylistDto,
  MoveFileToAnotherPlaylistRepository,
} from '../../../src';
import { ContentFileMock, PlaylistMock, userMock } from '../../entity';
import {
  FindContentFileByIdRepositoryMock,
  FindFileInFileToPlaylistRepositoryMock,
  FindPlaylistByIdRepositoryMock,
  FindUserByIdRepositoryMock,
  MoveFileToAnotherPlaylistRepositoryMock,
} from '../../repository';

interface SutTypes {
  sut: MoveFilesToAnotherPlaylist;
  moveFilesToAnotherPlaylistDto: MoveFilesToAnotherPlaylistDto;
  findUserByIdRepository: FindUserByIdRepository;
  findContentFileByIdRepository: FindContentFileByIdRepository;
  findFileInFileToPlaylistRepository: FindFileInFileToPlaylistRepository;
  findPlaylistByIdRepository: FindPlaylistByIdRepository;
  moveFileToAnotherPlaylistRepository: MoveFileToAnotherPlaylistRepository;
}

const makeSut = (): SutTypes => {
  const findUserByIdRepository = new FindUserByIdRepositoryMock();
  const findContentFileByIdRepository = new FindContentFileByIdRepositoryMock();
  const findFileInFileToPlaylistRepository: FindFileInFileToPlaylistRepository =
    {
      find: jest.fn(async () => ContentFileMock.id),
    };
  const findPlaylistByIdRepository = new FindPlaylistByIdRepositoryMock();
  const moveFileToAnotherPlaylistRepository =
    new MoveFileToAnotherPlaylistRepositoryMock();

  const moveFilesToAnotherPlaylistDto: MoveFilesToAnotherPlaylistDto = {
    filesId: [ContentFileMock.id],
    loggedUserId: userMock.userId,
    newPlaylistId: 'any_id',
    oldPlaylistId: PlaylistMock.id,
  };

  const sut = new MoveFilesToAnotherPlaylist(
    findUserByIdRepository,
    findContentFileByIdRepository,
    findPlaylistByIdRepository,
    findFileInFileToPlaylistRepository,
    moveFileToAnotherPlaylistRepository
  );

  return {
    findUserByIdRepository,
    findContentFileByIdRepository,
    findFileInFileToPlaylistRepository,
    findPlaylistByIdRepository,
    moveFileToAnotherPlaylistRepository,
    moveFilesToAnotherPlaylistDto,
    sut,
  };
};

describe('MoveFilesToAnotherPlaylist', () => {
  it('should return void when a correct move files to another playlist dto', async () => {
    const { sut, moveFilesToAnotherPlaylistDto } = makeSut();

    const result = await sut.execute(moveFilesToAnotherPlaylistDto);

    expect(result.isRight()).toBe(true);
    expect(result.isLeft()).toBe(false);
    expect(result.value).toStrictEqual(undefined);
  });
  it('should return EntityNotEmpty when a pass incorrect logged playlist id', async () => {
    const { sut, moveFilesToAnotherPlaylistDto } = makeSut();
    moveFilesToAnotherPlaylistDto.loggedUserId = '';
    const result = await sut.execute(moveFilesToAnotherPlaylistDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when a pass incorrect file id', async () => {
    const { sut, moveFilesToAnotherPlaylistDto } = makeSut();
    moveFilesToAnotherPlaylistDto.filesId[0] = '';
    const result = await sut.execute(moveFilesToAnotherPlaylistDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when a pass incorrect file id array', async () => {
    const { sut, moveFilesToAnotherPlaylistDto } = makeSut();
    moveFilesToAnotherPlaylistDto.filesId = [];
    const result = await sut.execute(moveFilesToAnotherPlaylistDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when a pass incorrect new Playlist id', async () => {
    const { sut, moveFilesToAnotherPlaylistDto } = makeSut();
    moveFilesToAnotherPlaylistDto.newPlaylistId = '';
    const result = await sut.execute(moveFilesToAnotherPlaylistDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when a pass incorrect new Playlist id', async () => {
    const { sut, moveFilesToAnotherPlaylistDto } = makeSut();
    moveFilesToAnotherPlaylistDto.newPlaylistId = '';
    const result = await sut.execute(moveFilesToAnotherPlaylistDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when a pass incorrect old Playlist id', async () => {
    const { sut, moveFilesToAnotherPlaylistDto } = makeSut();
    moveFilesToAnotherPlaylistDto.oldPlaylistId = '';
    const result = await sut.execute(moveFilesToAnotherPlaylistDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when a pass incorrect old Playlist id', async () => {
    const { sut, moveFilesToAnotherPlaylistDto } = makeSut();
    moveFilesToAnotherPlaylistDto.oldPlaylistId = '';
    const result = await sut.execute(moveFilesToAnotherPlaylistDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotCreated if there is no file to playlist created in the database', async () => {
    const {
      findContentFileByIdRepository,
      findUserByIdRepository,
      moveFilesToAnotherPlaylistDto,
      findPlaylistByIdRepository,
      moveFileToAnotherPlaylistRepository,
    } = makeSut();

    const mockEmptyRepository = new FindFileInFileToPlaylistRepositoryMock();

    const sut = new MoveFilesToAnotherPlaylist(
      findUserByIdRepository,
      findContentFileByIdRepository,
      findPlaylistByIdRepository,
      mockEmptyRepository,
      moveFileToAnotherPlaylistRepository
    );

    const result = await sut.execute(moveFilesToAnotherPlaylistDto);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotAssociate);
  });
});
