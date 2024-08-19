import {
  EditUser,
  EditUserDto,
  EditUserRepository,
  EntityNotEmpty,
  EntityNotExists,
  FindUserByIdRepository,
  InsufficientCharacters,
  StatusUser,
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
    expect(result.value).toBe(userMock.userId);
  });

  it('should return EntityNotEmpty if this id is empty', async () => {
    const { sut, editUserDto } = makeSut();
    editUserDto.id = '';

    const result = await sut.execute(editUserDto);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty if this status is empty', async () => {
    const { sut, editUserDto } = makeSut();
    editUserDto.status = {} as StatusUser;

    const result = await sut.execute(editUserDto);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return InsufficientCharacters when a incorrect name', async () => {
    const { sut, editUserDto } = makeSut();
    editUserDto.name = '';

    const result = await sut.execute(editUserDto);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InsufficientCharacters);
  });

  it('should return EntityNotExists when a pass incorrect Logged User ID', async () => {
    const { editUserDto, sut } = makeSut();
    jest
      .spyOn(sut['findUserByIdRepository'], 'find')
      .mockResolvedValueOnce({} as UserList);
    const result = await sut.execute(editUserDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });
});
