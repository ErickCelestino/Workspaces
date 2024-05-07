import {
  EditUser,
  EditUserDto,
  EditUserRepository,
  EntityNotExists,
  InsufficientCharacters,
} from '../../../src';
import { userMock } from '../../entity';
import { EditUserRepositoryMock } from '../../repository';

interface SutTypes {
  sut: EditUser;
  editUserDto: EditUserDto;
  editUserRepository: EditUserRepository;
}

const makeSut = (): SutTypes => {
  const editUserRepository = new EditUserRepositoryMock();

  const editUserDto: EditUserDto = {
    id: userMock.userId,
    name: userMock.name,
    birthDate: new Date(),
  };

  const sut = new EditUser(editUserRepository);

  return {
    editUserRepository,
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

  it('should return EntityNotExists if this id is empty', async () => {
    const { sut } = makeSut();

    const editUserDto: EditUserDto = {
      id: '',
      birthDate: new Date(),
      name: userMock.name,
    };

    const result = await sut.execute(editUserDto);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });

  it('should return InsufficientCharacters when a incorrect name', async () => {
    const { sut } = makeSut();

    const editUserDto: EditUserDto = {
      id: userMock.userId,
      birthDate: new Date(),
      name: '',
    };

    const result = await sut.execute(editUserDto);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InsufficientCharacters);
  });
});
