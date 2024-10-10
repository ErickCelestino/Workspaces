import {
  EntityNotComplete,
  EntityNotEmpty,
  EntityNotExists,
  EntityNotLoaded,
  FindUserByIdRepository,
  RegisterProfileImageRepository,
  UploadContentFileRepository,
  UploadedFile,
  UploadProfileImage,
  UploadProfileImageDto,
  UserList,
} from '../../../src';
import { UploadContentFileMock, userMock } from '../../entity';
import {
  FindUserByIdRepositoryMock,
  RegisterProfileImageRepositoryMock,
  UploadContentFileRepositoryMock,
} from '../../repository';

interface SutTypes {
  sut: UploadProfileImage;
  uploadProfileImageDto: UploadProfileImageDto;
  findUserByIdRepository: FindUserByIdRepository;
  uploadContentFileRepository: UploadContentFileRepository;
  registerProfileImageRepository: RegisterProfileImageRepository;
}

const makeSut = (): SutTypes => {
  const findUserByIdRepository = new FindUserByIdRepositoryMock();
  const uploadContentFileRepository = new UploadContentFileRepositoryMock();
  const registerProfileImageRepository =
    new RegisterProfileImageRepositoryMock();

  const uploadProfileImageDto: UploadProfileImageDto = {
    file: UploadContentFileMock,
    loggedUserId: userMock.userId,
  };

  const sut = new UploadProfileImage(
    findUserByIdRepository,
    uploadContentFileRepository,
    registerProfileImageRepository
  );

  return {
    findUserByIdRepository,
    uploadContentFileRepository,
    registerProfileImageRepository,
    uploadProfileImageDto,
    sut,
  };
};

describe('UploadProfileImage', () => {
  it('should return user ID when pass correct UploadProfileImageDto', async () => {
    const { sut, uploadProfileImageDto } = makeSut();

    const result = await sut.execute(uploadProfileImageDto);

    expect(result.isLeft()).toBeFalsy();
    expect(result.isRight()).toBeTruthy();
    expect(result.value).toStrictEqual(userMock.userId);
  });

  it('should return EntityNotEmpty when a passed empty file', async () => {
    const { sut, uploadProfileImageDto } = makeSut();
    uploadProfileImageDto.file = {} as UploadedFile;
    const result = await sut.execute(uploadProfileImageDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotExists when a not exist Logged User in system', async () => {
    const { uploadProfileImageDto, sut } = makeSut();
    jest
      .spyOn(sut['findUserByIdRepository'], 'find')
      .mockResolvedValueOnce({} as UserList);
    const result = await sut.execute(uploadProfileImageDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });

  it('should return EntityNotLoaded when a not upload profile image in system', async () => {
    const { uploadProfileImageDto, sut } = makeSut();
    jest
      .spyOn(sut['uploadContentFileRepository'], 'upload')
      .mockResolvedValueOnce('');
    const result = await sut.execute(uploadProfileImageDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotLoaded);
  });

  it('should return EntityNotComplete when a not register profile image in system', async () => {
    const { uploadProfileImageDto, sut } = makeSut();
    jest
      .spyOn(sut['registerProfileImageRepository'], 'register')
      .mockResolvedValueOnce('');
    const result = await sut.execute(uploadProfileImageDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotComplete);
  });
});
