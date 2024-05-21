import {
  EditUser,
  EditUserDto,
  EditUserRepository,
  EntityNotEmpty,
  EntityNotExists,
  FindUserByIdRepository,
  InsufficientCharacters,
  UserList,
} from '../../../src';
import { userMock } from '../../entity';
import {
  EditUserRepositoryMock,
  FindUserByIdRepositoryMock,
} from '../../repository';

interface SutTypes {
  sut: EditUser;
  editUserDto: EditUserDto;
  editUserRepository: EditUserRepository;
  findUserByIdRepository: FindUserByIdRepository;
}

const makeSut = (): SutTypes => {
  const editUserRepository = new EditUserRepositoryMock();
  const findUserByIdRepository = new FindUserByIdRepositoryMock();

  const editUserDto: EditUserDto = {
    id: userMock.userId,
    name: userMock.name,
    birthDate: new Date(),
    status: 'ACTIVE',
  };

  const sut = new EditUser(editUserRepository, findUserByIdRepository);

  return {
    editUserRepository,
    findUserByIdRepository,
    editUserDto,
    sut,
  };
};

describe('EditUser', () => {
  it('should return void when a correct user is edited', async () => {
    const { editUserDto, sut } = makeSut();

    const result = await sut.execute(editUserDto);

    expect(result.isLeft()).toBe(false);
    expect(result.isRight()).toBe(true);
    expect(result.value).toBe(undefined);
  });

  it('should return EntityNotEmpty if this id is empty', async () => {
    const { sut } = makeSut();

    const editUserDto: EditUserDto = {
      id: '',
      birthDate: new Date(),
      name: userMock.name,
      status: 'ACTIVE',
    };

    const result = await sut.execute(editUserDto);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return InsufficientCharacters when a incorrect name', async () => {
    const { sut } = makeSut();

    const editUserDto: EditUserDto = {
      id: userMock.userId,
      birthDate: new Date(),
      name: '',
      status: 'ACTIVE',
    };

    const result = await sut.execute(editUserDto);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InsufficientCharacters);
  });

  it('should return EntityNotExists when a not exist user in database', async () => {
    const { editUserDto, editUserRepository } = makeSut();

    const mockResult = {} as UserList;

    const mockEmptyRepository: FindUserByIdRepository = {
      find: jest.fn(async () => mockResult),
    };

    const sut = new EditUser(editUserRepository, mockEmptyRepository);

    const result = await sut.execute(editUserDto);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });
});
