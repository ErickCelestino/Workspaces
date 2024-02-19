import {
  CreateAuth,
  CreateAuthDto,
  CreateAuthRepository,
  EntityAlreadyExists,
  EntityNotExists,
  FilterByEmailOrNicknameRepository,
  FindUserByIdRepository,
  InsufficientCharacters,
  HashGenerator,
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
  it('should return undefined if send correct user', async () => {
    const { createAuthDto, sut } = makeSut();

    const result = await sut.execute(createAuthDto);

    expect(result.isRight()).toBe(true);
    expect(result.value).toBe(undefined);
  });

  it('should left InsufficientCharacters if sent an email with less than three characters', async () => {
    const { sut, createAuthDto } = makeSut();

    createAuthDto.email = '';

    const result = await sut.execute(createAuthDto);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InsufficientCharacters);
  });

  it('should left InsufficientCharacters if sent an password with less than three characters', async () => {
    const { sut, createAuthDto } = makeSut();

    createAuthDto.password = '';

    const result = await sut.execute(createAuthDto);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InsufficientCharacters);
  });

  it('should left EntityNotExists if sent an user id with less than three characters', async () => {
    const { sut, createAuthDto } = makeSut();

    createAuthDto.user_id = '';

    const result = await sut.execute(createAuthDto);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });

  it('should return EntityAlreadyExists if send email already exist in database', async () => {
    const { createAuthRepository, findUserByIdRepository, hashGenerator } =
      makeSut();

    const createAuthDto: CreateAuthDto = {
      user_id: 'invalid_id',
      email: authMock.email,
      password: 'valid_password',
    };

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

  it('should return EntityNotExists if send invalid user id', async () => {
    const {
      createAuthDto,
      createAuthRepository,
      filterEmailRepository,
      hashGenerator,
    } = makeSut();

    userMock.user_id = '';

    const mockEmptyRepository: FindUserByIdRepository = {
      find: jest.fn(async () => userMock),
    };

    const sut = new CreateAuth(
      filterEmailRepository,
      mockEmptyRepository,
      hashGenerator,
      createAuthRepository
    );

    const result = await sut.execute(createAuthDto);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });
});
