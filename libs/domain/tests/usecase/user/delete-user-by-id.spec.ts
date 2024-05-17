import {
  DeleteUserById,
  DeleteUserByIdDto,
  DeleteUserByIdRepository,
  EntityNotEmpty,
  EntityNotExists,
  FindUserByIdRepository,
  UserList,
} from '../../../src';
import { userMock } from '../../entity';
import {
  DeleteUserByIdRepositoryMock,
  FindUserByIdRepositoryMock,
} from '../../repository';

interface SutTypes {
  sut: DeleteUserById;
  deleteUserByIdDto: DeleteUserByIdDto;
  deleteUserByIdRepository: DeleteUserByIdRepository;
  findUserByIdRepository: FindUserByIdRepository;
}

const makeSut = (): SutTypes => {
  const deleteUserByIdRepository = new DeleteUserByIdRepositoryMock();
  const findUserByIdRepository = new FindUserByIdRepositoryMock();

  const deleteUserByIdDto: DeleteUserByIdDto = {
    id: userMock.userId,
  };

  const sut = new DeleteUserById(
    deleteUserByIdRepository,
    findUserByIdRepository
  );

  return {
    deleteUserByIdRepository,
    findUserByIdRepository,
    deleteUserByIdDto,
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

  it('should return EntityNotExists when a not exist user in database', async () => {
    const { deleteUserByIdDto, deleteUserByIdRepository } = makeSut();

    const mockResult = {} as UserList;

    const mockEmptyRepository: FindUserByIdRepository = {
      find: jest.fn(async () => mockResult),
    };

    const sut = new DeleteUserById(
      deleteUserByIdRepository,
      mockEmptyRepository
    );

    const result = await sut.execute(deleteUserByIdDto);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });
});
