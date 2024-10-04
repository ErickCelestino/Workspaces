import {
  ChangeUserType,
  ChangeUserTypeDto,
  ChangeUserTypeRepository,
  EntityNotComplete,
  EntityNotEmpty,
  EntityNotExists,
  EntityNotPermissions,
  FindUserByIdRepository,
  PermissionsUserResponseDto,
  UserList,
  VerifyUserPermissionsByIdRepository,
} from '../../../src';
import { listUserMock, userMock } from '../../entity';
import {
  ChangeUserTypeRepositoryMock,
  FindUserByIdRepositoryMock,
  VerifyUserPermissionsByIdRepositoryMock,
} from '../../repository';

interface SutTypes {
  sut: ChangeUserType;
  changeUserTypeDto: ChangeUserTypeDto;
  findUserByIdRepository: FindUserByIdRepository;
  verifyUserPermissionsByIdRepository: VerifyUserPermissionsByIdRepository;
  changeUserTypeRepository: ChangeUserTypeRepository;
}

const makeSut = (): SutTypes => {
  const findUserByIdRepository = new FindUserByIdRepositoryMock();
  const verifyUserPermissionsByIdRepository =
    new VerifyUserPermissionsByIdRepositoryMock();
  const changeUserTypeRepository = new ChangeUserTypeRepositoryMock();

  const changeUserTypeDto: ChangeUserTypeDto = {
    loggedUserId: userMock.userId,
    status: 'DEFAULT_ADMIN',
    userId: userMock.userId,
  };

  const sut = new ChangeUserType(
    findUserByIdRepository,
    verifyUserPermissionsByIdRepository,
    changeUserTypeRepository
  );

  return {
    findUserByIdRepository,
    verifyUserPermissionsByIdRepository,
    changeUserTypeRepository,
    changeUserTypeDto,
    sut,
  };
};

describe('ChangeUserType', () => {
  it('should return User ID when pass correct ChangeUserTypeDto', async () => {
    const { changeUserTypeDto, sut } = makeSut();

    const result = await sut.execute(changeUserTypeDto);

    expect(result.isLeft()).toBeFalsy();
    expect(result.isRight()).toBeTruthy();
    expect(result.value).toStrictEqual(userMock.userId);
  });

  it('should return EntityNotEmpty when a passed empty User Status', async () => {
    const { sut, changeUserTypeDto } = makeSut();
    changeUserTypeDto.status = '';
    const result = await sut.execute(changeUserTypeDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotExists when a exist Logged User in system', async () => {
    const { changeUserTypeDto, sut } = makeSut();
    jest
      .spyOn(sut['findUserByIdRepository'], 'find')
      .mockResolvedValueOnce({} as UserList);
    const result = await sut.execute(changeUserTypeDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });

  it('should return EntityNotExists when a exist User ID in system', async () => {
    const { changeUserTypeDto, sut } = makeSut();
    jest
      .spyOn(sut['findUserByIdRepository'], 'find')
      .mockResolvedValueOnce(listUserMock[0]);
    jest
      .spyOn(sut['findUserByIdRepository'], 'find')
      .mockResolvedValueOnce({} as UserList);
    const result = await sut.execute(changeUserTypeDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });

  it('should return EntityNotPermissions when a passed ADMIN User Status and the user is not admin', async () => {
    const { sut, changeUserTypeDto } = makeSut();
    changeUserTypeDto.status = 'ADMIN';
    jest
      .spyOn(sut['verifyUserPermissionsByIdRepository'], 'verify')
      .mockResolvedValueOnce({} as PermissionsUserResponseDto);
    const result = await sut.execute(changeUserTypeDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotPermissions);
  });

  it('should return EntityNotPermissions when a exist user in Company in system', async () => {
    const { changeUserTypeDto, sut } = makeSut();
    jest
      .spyOn(sut['verifyUserPermissionsByIdRepository'], 'verify')
      .mockResolvedValueOnce({} as PermissionsUserResponseDto);
    const result = await sut.execute(changeUserTypeDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotPermissions);
  });

  it('should return EntityNotComplete when a not complete change user type action', async () => {
    const { changeUserTypeDto, sut } = makeSut();
    jest
      .spyOn(sut['changeUserTypeRepository'], 'change')
      .mockResolvedValueOnce('');
    const result = await sut.execute(changeUserTypeDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotComplete);
  });
});
