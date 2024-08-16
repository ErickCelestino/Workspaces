import {
  CreateContentFileDto,
  CreateContentFile,
  FindUserByIdRepository,
  CreateContentFileRepository,
  FindDirectoryByIdRepository,
  EntityNotEmpty,
  EntityNotCreated,
  FileNotAllowed,
  UserList,
  EntityNotExists,
  Directory,
  UploadContentFileRepository,
  EntityNotLoaded,
  GenerateThumbnailRepository,
  EntityNotConverted,
} from '../../../src';
import { ContentFileMock, DirectoryMock, userMock } from '../../entity';
import {
  CreateContentFileRepositoryMock,
  FindDirectoryByIdRespositoryMock,
  FindUserByIdRepositoryMock,
  GenerateThumbnailRepositoryMock,
  UploadContentFileRepositoryMock,
} from '../../repository';

interface SutTypes {
  sut: CreateContentFile;
  CreateContentFileDto: CreateContentFileDto;
  findUserByIdRepository: FindUserByIdRepository;
  findDirectoryByIdRepository: FindDirectoryByIdRepository;
  CreateContentFileRepository: CreateContentFileRepository;
  generateThumbnailRepository: GenerateThumbnailRepository;
  uploadContentFileRepository: UploadContentFileRepository;
}

const makeSut = (): SutTypes => {
  const CreateContentFileRepository = new CreateContentFileRepositoryMock();
  const findUserByIdRepository = new FindUserByIdRepositoryMock();
  const findDirectoryByIdRepository = new FindDirectoryByIdRespositoryMock();
  const generateThumbnailRepository = new GenerateThumbnailRepositoryMock();
  const uploadContentFileRepository = new UploadContentFileRepositoryMock();
  const mockBuffer = {} as Buffer;
  const CreateContentFileDto: CreateContentFileDto = {
    directoryId: DirectoryMock.id,
    loggedUserId: userMock.userId,
    file: [
      {
        fieldname: 'any_fieldname',
        originalname: 'any_originalname',
        encoding: 'any_encoding',
        mimetype: 'image/png',
        buffer: mockBuffer,
        size: 1,
        filename: 'any_filename',
        path: 'any_path',
      },
    ],
  };

  const sut = new CreateContentFile(
    CreateContentFileRepository,
    findUserByIdRepository,
    findDirectoryByIdRepository,
    generateThumbnailRepository,
    uploadContentFileRepository
  );

  return {
    CreateContentFileRepository,
    findUserByIdRepository,
    findDirectoryByIdRepository,
    generateThumbnailRepository,
    uploadContentFileRepository,
    CreateContentFileDto,
    sut,
  };
};

describe('CreateContentFile', () => {
  it('should return void when a correct content video is created', async () => {
    const { CreateContentFileDto, sut } = makeSut();

    const result = await sut.execute(CreateContentFileDto);
    const resultResponse = [ContentFileMock.id];
    expect(result.isLeft()).toBe(false);
    expect(result.isRight()).toBe(true);
    expect(result.value).toStrictEqual(resultResponse);
  });

  it('should return EntityNotEmpty when a pass incorrect logged user id', async () => {
    const { CreateContentFileDto, sut } = makeSut();
    CreateContentFileDto.loggedUserId = '';
    const result = await sut.execute(CreateContentFileDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when a pass incorrect directory id', async () => {
    const { CreateContentFileDto, sut } = makeSut();
    CreateContentFileDto.directoryId = '';
    const result = await sut.execute(CreateContentFileDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when a pass incorrect file', async () => {
    const { CreateContentFileDto, sut } = makeSut();
    CreateContentFileDto.file = [];
    const result = await sut.execute(CreateContentFileDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotCreated if there is no content video created in the database', async () => {
    const { sut, CreateContentFileDto } = makeSut();
    jest
      .spyOn(sut['createContentFileRepository'], 'create')
      .mockResolvedValueOnce('');

    const result = await sut.execute(CreateContentFileDto);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotCreated);
  });

  it('should return FileNotAllowed when a pass incorrect file', async () => {
    const { CreateContentFileDto, sut } = makeSut();
    CreateContentFileDto.file[0].mimetype = '';
    const result = await sut.execute(CreateContentFileDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(FileNotAllowed);
  });

  it('should return EntityNotExists when a pass incorrect Logged User ID', async () => {
    const { CreateContentFileDto, sut } = makeSut();
    jest
      .spyOn(sut['findUserByIdRepository'], 'find')
      .mockResolvedValueOnce({} as UserList);
    const result = await sut.execute(CreateContentFileDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });

  it('should return EntityNotExists when a pass incorrect Directory ID', async () => {
    const { CreateContentFileDto, sut } = makeSut();
    jest
      .spyOn(sut['findDirectoryByIdRepository'], 'find')
      .mockResolvedValueOnce({} as Directory);
    const result = await sut.execute(CreateContentFileDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });

  it('should return EntityNotLoaded when not loaded content file in cloud', async () => {
    const { CreateContentFileDto, sut } = makeSut();
    jest
      .spyOn(sut['uploadContentFileRepository'], 'upload')
      .mockResolvedValueOnce('');
    const result = await sut.execute(CreateContentFileDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotLoaded);
  });

  it('should return EntityNotConverted when not converted content file in system', async () => {
    const { CreateContentFileDto, sut } = makeSut();

    CreateContentFileDto.file[0].mimetype = 'video/mp4';
    CreateContentFileDto.file[0].buffer = Buffer.from('valid buffer content');

    const result = await sut.execute(CreateContentFileDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotConverted);
  });

  it('should return EntityNotLoaded when not uploaded content file in system', async () => {
    const { CreateContentFileDto, sut } = makeSut();
    jest
      .spyOn(sut['generateThumbnailRepository'], 'generate')
      .mockResolvedValueOnce(Buffer.from('files'));
    jest
      .spyOn(sut['uploadContentFileRepository'], 'upload')
      .mockResolvedValueOnce('');

    CreateContentFileDto.file[0].mimetype = 'video/mp4';
    CreateContentFileDto.file[0].buffer = Buffer.from('valid buffer content');

    const result = await sut.execute(CreateContentFileDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotLoaded);
  });
});
