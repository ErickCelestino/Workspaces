import {
  CreateError,
  CreateUser,
  CreateUserDto,
  CreateUserRepository,
  EntityAlreadyExists,
  InsufficientCharacters,
} from '../../../src';
import { FilterByEmailOrNicknameDto } from '../../../src/lib/dto/user/filter-by-email-or-nickname.dto';
import { FilterByEmailOrNicknameRepository } from '../../../src/lib/repository/user/filter-by-email-or-nickname';
import { userMock } from '../../entity';
import {
  CreateUserRepositoryMock,
  FilterByEmailOrNicknameRepositoryMock,
} from '../../repository';

interface SutTypes {
  sut: CreateUser;
  createUserDto: CreateUserDto;
  filterNickNameDto: FilterByEmailOrNicknameDto;
  createUserRepository: CreateUserRepository;
  filterNickNameRepository: FilterByEmailOrNicknameRepository;
}

const makeSut = (): SutTypes => {
  const createUserRepository = new CreateUserRepositoryMock();
  const filterNickNameRepository = new FilterByEmailOrNicknameRepositoryMock();

  const createUserDto: CreateUserDto = {
    name: userMock.name,
    nickname: userMock.nickname,
    birthDate: new Date(),
  };

  const filterNickNameDto: FilterByEmailOrNicknameDto = {
    nickName: userMock.nickname,
  };

  const sut = new CreateUser(createUserRepository, filterNickNameRepository);

  return {
    createUserRepository,
    filterNickNameRepository,
    createUserDto,
    filterNickNameDto,
    sut,
  };
};

describe('CreateUser', () => {
  it('should return void when a correct user is created', async () => {
    const { createUserDto, sut } = makeSut();

    const result = await sut.execute(createUserDto);
    console.log(result.value);

    expect(result.isLeft()).toBe(false);
    expect(result.isRight()).toBe(true);
    expect(result.value).toBe(userMock.userId);
  });

  it('should return InsufficientCharacters when a incorrect name', async () => {
    const { sut } = makeSut();

    const createUserDto: CreateUserDto = {
      name: '',
      nickname: userMock.nickname,
      birthDate: new Date(),
    };

    const result = await sut.execute(createUserDto);

    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(InsufficientCharacters);
  });

  it('should return InsufficientCharacters when a incorrect nickName', async () => {
    const { sut } = makeSut();

    const createUserDto: CreateUserDto = {
      name: userMock.name,
      nickname: '',
      birthDate: new Date(),
    };

    const result = await sut.execute(createUserDto);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InsufficientCharacters);
  });

  it('should return EntityAlreadyExists if already exist  user in database', async () => {
    const { createUserDto, createUserRepository } = makeSut();

    const mockEmptyRepository: FilterByEmailOrNicknameRepository = {
      filter: jest.fn(async () => userMock),
    };

    const sut = new CreateUser(createUserRepository, mockEmptyRepository);

    const result = await sut.execute(createUserDto);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityAlreadyExists);
  });

  it('should return CreateError if there is no user created in the database', async () => {
    const { createUserDto, filterNickNameRepository } = makeSut();

    const mockEmptyRepository: CreateUserRepository = {
      create: jest.fn(async () => ''),
    };

    const sut = new CreateUser(mockEmptyRepository, filterNickNameRepository);

    const result = await sut.execute(createUserDto);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(CreateError);
  });
});
