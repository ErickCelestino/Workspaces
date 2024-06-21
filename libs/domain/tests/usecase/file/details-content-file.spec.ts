import {
  ContentFile,
  DetailsContentFile,
  DetailsContentFileDto,
  Directory,
  EntityNotEmpty,
  EntityNotExists,
  FindContentFileByIdRepository,
  FindDirectoryByIdRepository,
  FindUserByIdRepository,
  UserList,
} from '../../../src';
import { ContentFileMock, DirectoryMock, userMock } from '../../entity';
import {
  FindContentFileByIdRepositoryMock,
  FindDirectoryByIdRespositoryMock,
  FindUserByIdRepositoryMock,
} from '../../repository';

interface SutTypes {
  sut: DetailsContentFile;
  detailsContentFileByIdDto: DetailsContentFileDto;
  findUserByIdRepository: FindUserByIdRepository;
  findDirectoryByIdRepository: FindDirectoryByIdRepository;
  findContentFileByIdRepository: FindContentFileByIdRepository;
}

const makeSut = (): SutTypes => {
  const findUserByIdRepository = new FindUserByIdRepositoryMock();
  const findDirectoryByIdRepository = new FindDirectoryByIdRespositoryMock();
  const findContentFileByIdRepository = new FindContentFileByIdRepositoryMock();
  const detailsContentFileByIdDto: DetailsContentFileDto = {
    directoryId: DirectoryMock.id,
    loggedUserId: userMock.userId,
    id: ContentFileMock.id,
  };

  const sut = new DetailsContentFile(
    findUserByIdRepository,
    findDirectoryByIdRepository,
    findContentFileByIdRepository
  );

  return {
    findUserByIdRepository,
    findDirectoryByIdRepository,
    findContentFileByIdRepository,
    detailsContentFileByIdDto,
    sut,
  };
};

describe('DeleteContentFileById', () => {
  it('should return content file when a exist content file in database', async () => {
    const { detailsContentFileByIdDto, sut } = makeSut();

    const result = await sut.execute(detailsContentFileByIdDto);
    expect(result.isLeft()).toBe(false);
    expect(result.isRight()).toBe(true);
    expect(result.value).toStrictEqual(ContentFileMock);
  });
  it('should return EntityNotEmpty when a pass incorrect logged user id', async () => {
    const { detailsContentFileByIdDto, sut } = makeSut();
    detailsContentFileByIdDto.loggedUserId = '';
    const result = await sut.execute(detailsContentFileByIdDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when a pass incorrect directory id', async () => {
    const { detailsContentFileByIdDto, sut } = makeSut();
    detailsContentFileByIdDto.directoryId = '';
    const result = await sut.execute(detailsContentFileByIdDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when a pass incorrect id to delete', async () => {
    const { detailsContentFileByIdDto, sut } = makeSut();
    detailsContentFileByIdDto.id = '';
    const result = await sut.execute(detailsContentFileByIdDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotExists if there is no user created in the database', async () => {
    const {
      detailsContentFileByIdDto,
      findDirectoryByIdRepository,
      findContentFileByIdRepository,
    } = makeSut();

    const mockEmptyItem = {} as UserList;

    const mockEmptyRepository: FindUserByIdRepository = {
      find: jest.fn(async () => mockEmptyItem),
    };

    const sut = new DetailsContentFile(
      mockEmptyRepository,
      findDirectoryByIdRepository,
      findContentFileByIdRepository
    );

    const result = await sut.execute(detailsContentFileByIdDto);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });

  it('should return EntityNotExists if there is no directory created in the database', async () => {
    const {
      detailsContentFileByIdDto,
      findUserByIdRepository,

      findContentFileByIdRepository,
    } = makeSut();

    const mockEmptyItem = {} as Directory;

    const mockEmptyRepository: FindDirectoryByIdRepository = {
      find: jest.fn(async () => mockEmptyItem),
    };

    const sut = new DetailsContentFile(
      findUserByIdRepository,
      mockEmptyRepository,
      findContentFileByIdRepository
    );

    const result = await sut.execute(detailsContentFileByIdDto);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });

  it('should return EntityNotExists if there is no content file created in the database', async () => {
    const {
      detailsContentFileByIdDto,
      findUserByIdRepository,
      findDirectoryByIdRepository,
    } = makeSut();

    const mockEmptyItem = {} as ContentFile;

    const mockEmptyRepository: FindContentFileByIdRepository = {
      find: jest.fn(async () => mockEmptyItem),
    };

    const sut = new DetailsContentFile(
      findUserByIdRepository,
      findDirectoryByIdRepository,
      mockEmptyRepository
    );

    const result = await sut.execute(detailsContentFileByIdDto);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });
});
