// eslint-disable-next-line @nx/enforce-module-boundaries
import { HashGenerator } from '../../../../utils-core';
import {
  CreateAuth,
  CreateAuthDto,
  CreateAuthRepository,
  EntityAlreadyExists,
  EntityNotExists,
  FilterByEmailOrNicknameRepository,
  FindUserByIdRepository,
  InsufficientCharacters,
} from '../../../src';
import { userMock } from '../../entity';
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
  it('should left InsufficientCharacters if sent an email with less than three characters', async () => {
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

  it('should left InsufficientCharacters if sent an password with less than three characters', async () => {
    const { sut } = makeSut();

    const createAuthDto: CreateAuthDto = {
      email: authMock.email,
      password: '',
      user_id: authMock.user_id,
    };

    const result = await sut.execute(createAuthDto);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InsufficientCharacters);
  });

  it('should left EntityNotExists if sent an user id with less than three characters', async () => {
    const { sut } = makeSut();

    const createAuthDto: CreateAuthDto = {
      email: authMock.email,
      password: 'aaa',
      user_id: '',
    };

    const result = await sut.execute(createAuthDto);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });

  it('should return EntityAlreadyExists if send email already exist in database', async () => {
    const {
      createAuthDto,
      createAuthRepository,
      findUserByIdRepository,
      hashGenerator,
    } = makeSut();

    const mockEmptyRepository: FilterByEmailOrNicknameRepository = {
      filter: jest.fn(async () => [userMock]),
    };

    const sut = new CreateAuth(
      mockEmptyRepository,
      findUserByIdRepository,
      hashGenerator,
      createAuthRepository
    );

    const result = await sut.execute(createAuthDto);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityAlreadyExists);
  });
});
