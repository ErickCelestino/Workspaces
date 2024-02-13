// eslint-disable-next-line @nx/enforce-module-boundaries
import { HashGenerator } from '../../../../utils-core';
import {
  CreateAuth,
  CreateAuthDto,
  CreateAuthRepository,
  FilterByEmailOrNicknameRepository,
  FindUserByIdRepository,
  InsufficientCharacters,
} from '../../../src';
import { authMock } from '../../entity/user/auth.mock';
import {
  CreateAuthRepositoryMock,
  FilterByEmailOrNicknameRepositoryMock,
  FindUserByIdRepositoryMock,
  HashGeneratorMock,
} from '../../repository';

interface SutTypes {
  sut: CreateAuth;
  createAuthDto: CreateAuthDto;
  createAuthRepository: CreateAuthRepository;
  findUserByIdRepository: FindUserByIdRepository;
  filterEmailRepository: FilterByEmailOrNicknameRepository;
  hashGenerator: HashGenerator;
}

const makeSut = (): SutTypes => {
  const createAuthRepository = new CreateAuthRepositoryMock();
  const findUserByIdRepository = new FindUserByIdRepositoryMock();
  const hashGenerator = new HashGeneratorMock();
  const filterEmailRepository = new FilterByEmailOrNicknameRepositoryMock();
  const createAuthDto: CreateAuthDto = {
    email: authMock.email,
    password: 'any_password',
    user_id: authMock.auth_id,
  };

  const sut = new CreateAuth(
    filterEmailRepository,
    findUserByIdRepository,
    hashGenerator,
    createAuthRepository
  );

  return {
    sut,
    createAuthDto,
    createAuthRepository,
    findUserByIdRepository,
    filterEmailRepository,
    hashGenerator,
  };
};

describe('CreateAuth', () => {
  it('', async () => {
    const { sut } = makeSut();

    const createAuthDto: CreateAuthDto = {
      email: '',
      password: 'aaa',
      user_id: authMock.user_id,
    };

    const result = await sut.execute(createAuthDto);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InsufficientCharacters);
  });
});
