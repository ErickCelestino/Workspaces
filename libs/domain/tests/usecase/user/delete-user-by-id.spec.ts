import {
  DeleteUserById,
  DeleteUserByIdDto,
  DeleteUserByIdRepository,
  EntityNotEmpty,
  EntityNotExists,
  FindUserByIdRepository,
  NotPermissionError,
  UserList,
  VerifyUserPermissionsByIdRepository,
} from '../../../src';
import { listUserMock, userMock } from '../../entity';
import {
  DeleteUserByIdRepositoryMock,
  FindUserByIdRepositoryMock,
  VerifyUserPermissionsByIdRepositoryMock,
} from '../../repository';

interface SutTypes {
  sut: DeleteUserById;
  deleteUserByIdDto: DeleteUserByIdDto;
  deleteUserByIdRepository: DeleteUserByIdRepository;
  findUserByIdRepository: FindUserByIdRepository;
  verifyUserPermissionsByIdRepository: VerifyUserPermissionsByIdRepository;
}

const makeSut = (): SutTypes => {
  const deleteUserByIdRepository = new DeleteUserByIdRepositoryMock();
  const findUserByIdRepository = new FindUserByIdRepositoryMock();
  const verifyUserPermissionsByIdRepository =
    new VerifyUserPermissionsByIdRepositoryMock();

  const deleteUserByIdDto: DeleteUserByIdDto = {
    id: userMock.userId,
    description: 'any_description',
    loggedUser: userMock.userId,
  };

  const sut = new DeleteUserById(
    deleteUserByIdRepository,
    findUserByIdRepository,
    verifyUserPermissionsByIdRepository
  );

  return {
    deleteUserByIdRepository,
    findUserByIdRepository,
    deleteUserByIdDto,
    verifyUserPermissionsByIdRepository,
    sut,
  };
};

describe('DeleteUserById', () => {
  it('should return void when a passed correct user id', async () => {
    const { sut, deleteUserByIdDto } = makeSut();

    const result = await sut.execute(deleteUserByIdDto);

    expect(result.isLeft()).toBe(false);
    expect(result.isRight()).toBe(true);
    expect(result.value).toBe(undefined);
  });

  it('should return EntityNotEmpty when a passed empty user id', async () => {
    const { sut, deleteUserByIdDto } = makeSut();
    deleteUserByIdDto.id = '';
    const result = await sut.execute(deleteUserByIdDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when a passed empty logged user id', async () => {
    const { sut, deleteUserByIdDto } = makeSut();
    deleteUserByIdDto.loggedUser = '';
    const result = await sut.execute(deleteUserByIdDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when a passed empty description', async () => {
    const { sut, deleteUserByIdDto } = makeSut();
    deleteUserByIdDto.description = '';
    const result = await sut.execute(deleteUserByIdDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return NotPermissionError when a logged user passed it does not have permission in database', async () => {
    const { deleteUserByIdDto, sut } = makeSut();
    jest
      .spyOn(sut['verifyUserPermissionsByIdRepository'], 'verify')
      .mockResolvedValueOnce({
        status: 'ACTIVE',
        type: 'DEFAULT',
      });

    deleteUserByIdDto.id = 'any_id';
    const result = await sut.execute(deleteUserByIdDto);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotPermissionError);
  });

  it('should return EntityNotExists when a pass incorrect Logged User ID', async () => {
    const { deleteUserByIdDto, sut } = makeSut();
    jest
      .spyOn(sut['findUserByIdRepository'], 'find')
      .mockResolvedValueOnce({} as UserList);
    const result = await sut.execute(deleteUserByIdDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });

  it('should return EntityNotExists when a pass incorrect Logged User ID', async () => {
    const { deleteUserByIdDto, sut } = makeSut();
    jest
      .spyOn(sut['findUserByIdRepository'], 'find')
      .mockResolvedValueOnce(listUserMock[0]);
    jest
      .spyOn(sut['findUserByIdRepository'], 'find')
      .mockResolvedValueOnce({} as UserList);
    const result = await sut.execute(deleteUserByIdDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });
});
