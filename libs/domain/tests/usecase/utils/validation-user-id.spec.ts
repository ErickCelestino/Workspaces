import {
  EntityNotEmpty,
  EntityNotExists,
  FindUserByIdRepository,
  UserList,
  ValidationUserId,
} from '../../../src';
import { FindUserByIdRepositoryMock } from '../../repository';

const makeSut = (id: string, repository: FindUserByIdRepository) => {
  const sut = ValidationUserId(id, repository);

  return {
    sut,
  };
};

describe('ValidationUserId', () => {
  it('should return undefined when exist user id in database', async () => {
    const { sut } = makeSut('any_id', new FindUserByIdRepositoryMock());

    const result = await sut;
    expect(result.value).toStrictEqual(undefined);
  });

  it('should return EntityNotEmpty when no pass correct user id', async () => {
    const { sut } = makeSut('', new FindUserByIdRepositoryMock());

    const result = await sut;
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotExists when no pass correct user id', async () => {
    const mockEmptyItem = {} as UserList;

    const mockEmptyRepository: FindUserByIdRepository = {
      find: jest.fn(async () => mockEmptyItem),
    };
    const { sut } = makeSut('any_id', mockEmptyRepository);

    const result = await sut;
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });
});
