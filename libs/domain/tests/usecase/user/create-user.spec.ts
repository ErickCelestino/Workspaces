import {
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
    nickName: userMock.nickname,
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
    const { sut, createUserDto } = makeSut();

    const result = await sut.execute(createUserDto);
    console.log(result.value);

    expect(result.isLeft()).toBe(false);
    expect(result.isRight()).toBe(true);
    expect(result.value).toBe(undefined);
  });

  it('should return InsufficientCharacters when a incorrect name', async () => {
    const { sut } = makeSut();

    const createUserDto: CreateUserDto = {
      name: '',
      nickName: userMock.nickname,
    };

    const result = await sut.execute(createUserDto);

    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(InsufficientCharacters);
  });

  it('should return InsufficientCharacters when a incorrect nickName', async () => {
    const { sut } = makeSut();

    const createUserDto: CreateUserDto = {
      name: userMock.name,
      nickName: '',
    };

    const result = await sut.execute(createUserDto);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InsufficientCharacters);
  });

  it('should return EntityAlreadyExists if already exist  user in database', async () => {
    const { createUserDto, createUserRepository } = makeSut();

    const mockEmptyRepository: FilterByEmailOrNicknameRepository = {
      filter: jest.fn(async () => [userMock]),
    };

    const sut = new CreateUser(createUserRepository, mockEmptyRepository);

    const result = await sut.execute(createUserDto);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityAlreadyExists);
  });
});
