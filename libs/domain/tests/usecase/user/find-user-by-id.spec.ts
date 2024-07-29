import {
  EntityNotEmpty,
  EntityNotExists,
  FindUserById,
  FindUserByIdRepository,
  UserList,
} from '../../../src';
import { listUserMock } from '../../entity';
import { FindUserByIdRepositoryMock } from '../../repository';

interface SutTypes {
  sut: FindUserById;
  findUserByIdRepository: FindUserByIdRepository;
}

const makeSut = (): SutTypes => {
  const findUserByIdRepository = new FindUserByIdRepositoryMock();

  const sut = new FindUserById(findUserByIdRepository);

  return {
    sut,
    findUserByIdRepository,
  };
};

describe('FindUserById', () => {
  it('should return user when a pass correct user id', async () => {
    const { sut } = makeSut();

    const result = await sut.execute(listUserMock[0].userId);

    expect(result.isLeft()).toBe(false);
    expect(result.isRight()).toBe(true);
    expect(result.value).toBe(listUserMock[0]);
  });

  it('should return EntityNotEmpty when a pass incorrect user id', async () => {
    const { sut } = makeSut();

    const result = await sut.execute('');

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotExists when not exist user id in database', async () => {
    const { sut } = makeSut();
    jest
      .spyOn(sut['findUserByIdRepository'], 'find')
      .mockResolvedValueOnce({} as UserList);

    const result = await sut.execute(listUserMock[0].userId);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });
});
