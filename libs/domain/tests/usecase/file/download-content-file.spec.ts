import {
  ContentFile,
  Directory,
  DownloadContentFile,
  DownloadContentFileDto,
  DownloadContentFileRepository,
  EntityNotEmpty,
  EntityNotExists,
  FindContentFileByIdRepository,
  FindDirectoryByIdRepository,
  FindUserByIdRepository,
} from '../../../src';
import { ContentFileMock, DirectoryMock, userMock } from '../../entity';
import {
  DownloadContentFileRepositoryMock,
  FindContentFileByIdRepositoryMock,
  FindDirectoryByIdRespositoryMock,
  FindUserByIdRepositoryMock,
} from '../../repository';

interface SutTypes {
  sut: DownloadContentFile;
  downloadContentFileDto: DownloadContentFileDto;
  findUserByIdRepository: FindUserByIdRepository;
  findDirectoryByIdRepository: FindDirectoryByIdRepository;
  findContentFileByIdRepository: FindContentFileByIdRepository;
  downloadContentFileRepository: DownloadContentFileRepository;
}

const makeSut = (): SutTypes => {
  const downloadContentFileRepository = new DownloadContentFileRepositoryMock();
  const findUserByIdRepository = new FindUserByIdRepositoryMock();
  const findDirectoryByIdRepository = new FindDirectoryByIdRespositoryMock();
  const findContentFileByIdRepository = new FindContentFileByIdRepositoryMock();
  const downloadContentFileDto: DownloadContentFileDto = {
    directoryId: DirectoryMock.id,
    loggedUserId: userMock.userId,
    idToDownload: ContentFileMock.id,
  };

  const sut = new DownloadContentFile(
    findUserByIdRepository,
    findDirectoryByIdRepository,
    findContentFileByIdRepository,
    downloadContentFileRepository
  );

  return {
    findUserByIdRepository,
    findDirectoryByIdRepository,
    findContentFileByIdRepository,
    downloadContentFileRepository,
    downloadContentFileDto,
    sut,
  };
};

describe('DownloadContentFile', () => {
  it('should return void when a correct content file is download', async () => {
    const { downloadContentFileDto, sut } = makeSut();

    const result = await sut.execute(downloadContentFileDto);
    expect(result.isLeft()).toBe(false);
    expect(result.isRight()).toBe(true);
    expect(result.value).toStrictEqual({
      url: 'any_url',
      fileName: ContentFileMock.fileName,
    });
  });
  it('should return EntityNotEmpty when a pass incorrect logged user id', async () => {
    const { downloadContentFileDto, sut } = makeSut();
    downloadContentFileDto.loggedUserId = '';
    const result = await sut.execute(downloadContentFileDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when a pass incorrect directory id', async () => {
    const { downloadContentFileDto, sut } = makeSut();
    downloadContentFileDto.directoryId = '';
    const result = await sut.execute(downloadContentFileDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when a pass incorrect id to delete', async () => {
    const { downloadContentFileDto, sut } = makeSut();
    downloadContentFileDto.idToDownload = '';
    const result = await sut.execute(downloadContentFileDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotExists if there is no directory created in the database', async () => {
    const {
      downloadContentFileDto,
      findUserByIdRepository,
      downloadContentFileRepository,
      findContentFileByIdRepository,
    } = makeSut();

    const mockEmptyItem = {} as Directory;

    const mockEmptyRepository: FindDirectoryByIdRepository = {
      find: jest.fn(async () => mockEmptyItem),
    };

    const sut = new DownloadContentFile(
      findUserByIdRepository,
      mockEmptyRepository,
      findContentFileByIdRepository,
      downloadContentFileRepository
    );

    const result = await sut.execute(downloadContentFileDto);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });

  it('should return EntityNotExists if there is no content file created in the database', async () => {
    const {
      downloadContentFileDto,
      findUserByIdRepository,
      downloadContentFileRepository,
      findDirectoryByIdRepository,
    } = makeSut();

    const mockEmptyItem = {} as ContentFile;

    const mockEmptyRepository: FindContentFileByIdRepository = {
      find: jest.fn(async () => mockEmptyItem),
    };

    const sut = new DownloadContentFile(
      findUserByIdRepository,
      findDirectoryByIdRepository,
      mockEmptyRepository,
      downloadContentFileRepository
    );

    const result = await sut.execute(downloadContentFileDto);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });

  it('should return EntityNotExists if there is no generate url for download file', async () => {
    const {
      downloadContentFileDto,
      findUserByIdRepository,
      findContentFileByIdRepository,
      findDirectoryByIdRepository,
    } = makeSut();

    const mockEmptyRepository: DownloadContentFileRepository = {
      download: jest.fn(async () => ''),
    };

    const sut = new DownloadContentFile(
      findUserByIdRepository,
      findDirectoryByIdRepository,
      findContentFileByIdRepository,
      mockEmptyRepository
    );

    const result = await sut.execute(downloadContentFileDto);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });
});
