import {
  DeletePlaylistFileRepository,
  DeletePlaylistFiles,
  DeletePlaylistFilesDto,
  EntityNotAssociate,
  EntityNotEmpty,
  FindContentFileByIdRepository,
  FindFileInFileToPlaylistRepository,
  FindPlaylistByIdRepository,
  FindUserByIdRepository,
} from '../../../src';
import { ContentFileMock, PlaylistMock, userMock } from '../../entity';
import {
  DeletePlaylistFileRepositoryMock,
  FindContentFileByIdRepositoryMock,
  FindFileInFileToPlaylistRepositoryMock,
  FindPlaylistByIdRepositoryMock,
  FindUserByIdRepositoryMock,
} from '../../repository';

interface SutTypes {
  sut: DeletePlaylistFiles;
  deletePlaylistFilesDto: DeletePlaylistFilesDto;
  findUserByIdRepository: FindUserByIdRepository;
  findContentFileByIdRepository: FindContentFileByIdRepository;
  findFileInFileToPlaylistRepository: FindFileInFileToPlaylistRepository;
  findPlaylistByIdRepository: FindPlaylistByIdRepository;
  deletePlaylistFileRepository: DeletePlaylistFileRepository;
}

const makeSut = (): SutTypes => {
  const findUserByIdRepository = new FindUserByIdRepositoryMock();
  const findContentFileByIdRepository = new FindContentFileByIdRepositoryMock();
  const findFileInFileToPlaylistRepository: FindFileInFileToPlaylistRepository =
    {
      find: jest.fn(async () => ContentFileMock.id),
    };
  const findPlaylistByIdRepository = new FindPlaylistByIdRepositoryMock();
  const deletePlaylistFileRepository = new DeletePlaylistFileRepositoryMock();

  const deletePlaylistFilesDto: DeletePlaylistFilesDto = {
    filesId: [ContentFileMock.id],
    loggedUserId: userMock.userId,
    playlistId: PlaylistMock.id,
  };

  const sut = new DeletePlaylistFiles(
    findUserByIdRepository,
    findContentFileByIdRepository,
    findFileInFileToPlaylistRepository,
    findPlaylistByIdRepository,
    deletePlaylistFileRepository
  );

  return {
    findUserByIdRepository,
    findContentFileByIdRepository,
    findFileInFileToPlaylistRepository,
    findPlaylistByIdRepository,
    deletePlaylistFileRepository,
    deletePlaylistFilesDto,
    sut,
  };
};

describe('DeletePlaylistFiles', () => {
  it('should return undefined when passa correct DeletePlaylistFilesDto', async () => {
    const { sut, deletePlaylistFilesDto } = makeSut();

    const result = await sut.execute(deletePlaylistFilesDto);

    expect(result.isRight()).toBe(true);
    expect(result.isLeft()).toBe(false);
    expect(result.value).toBeUndefined();
  });

  it('should return EntityNotEmpty when a pass incorrect logged id', async () => {
    const { sut, deletePlaylistFilesDto } = makeSut();
    deletePlaylistFilesDto.loggedUserId = '';
    const result = await sut.execute(deletePlaylistFilesDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when a pass incorrect playlist id', async () => {
    const { sut, deletePlaylistFilesDto } = makeSut();
    deletePlaylistFilesDto.playlistId = '';
    const result = await sut.execute(deletePlaylistFilesDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when a pass incorrect file id list', async () => {
    const { sut, deletePlaylistFilesDto } = makeSut();
    deletePlaylistFilesDto.filesId = [];
    const result = await sut.execute(deletePlaylistFilesDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when a pass incorrect file id', async () => {
    const { sut, deletePlaylistFilesDto } = makeSut();
    deletePlaylistFilesDto.filesId[0] = '';
    const result = await sut.execute(deletePlaylistFilesDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotCreated if there is no file to playlist created in the database', async () => {
    const {
      findContentFileByIdRepository,
      findUserByIdRepository,
      deletePlaylistFilesDto,
      findPlaylistByIdRepository,
      deletePlaylistFileRepository,
    } = makeSut();

    const mockEmptyRepository = new FindFileInFileToPlaylistRepositoryMock();

    const sut = new DeletePlaylistFiles(
      findUserByIdRepository,
      findContentFileByIdRepository,
      mockEmptyRepository,
      findPlaylistByIdRepository,
      deletePlaylistFileRepository
    );

    const result = await sut.execute(deletePlaylistFilesDto);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotAssociate);
  });
});
