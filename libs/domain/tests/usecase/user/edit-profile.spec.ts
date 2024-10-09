import {
  EditProfile,
  EditProfileDto,
  EditProfileRepository,
  EntityNotComplete,
  EntityNotEmpty,
  EntityNotExists,
  EntityNotValid,
  FindUserByIdRepository,
  UserList,
} from '../../../src';
import {
  EditProfileRepositoryMock,
  FindUserByIdRepositoryMock,
} from '../../repository';
import { listUserMock, userMock } from '../../entity';

interface SutTypes {
  sut: EditProfile;
  editProfileDto: EditProfileDto;
  findUserByIdRepository: FindUserByIdRepository;
  editProfileRepository: EditProfileRepository;
}

const makeSut = (): SutTypes => {
  const findUserByIdRepository = new FindUserByIdRepositoryMock();
  const editProfileRepository = new EditProfileRepositoryMock();

  const editProfileDto: EditProfileDto = {
    body: {
      id: userMock.userId,
      name: userMock.name,
    },
    loggedUserId: userMock.userId,
  };

  const sut = new EditProfile(findUserByIdRepository, editProfileRepository);

  return {
    findUserByIdRepository,
    editProfileRepository,
    editProfileDto,
    sut,
  };
};

describe('EditProfile', () => {
  it('should return user ID when pass correct EditProfileDto', async () => {
    const { editProfileDto, sut } = makeSut();

    const result = await sut.execute(editProfileDto);

    expect(result.isLeft()).toBeFalsy();
    expect(result.isRight()).toBeTruthy();
    expect(result.value).toStrictEqual(userMock.userId);
  });

  it('should return EntityNotEmpty when a passed empty logged user id', async () => {
    const { sut, editProfileDto } = makeSut();
    editProfileDto.body.name = '';
    const result = await sut.execute(editProfileDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotValid when a passed logged user id being different from user ID', async () => {
    const { sut, editProfileDto } = makeSut();
    editProfileDto.body.id = '1';
    editProfileDto.loggedUserId = '2';
    const result = await sut.execute(editProfileDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotValid);
  });

  it('should return EntityNotExists when a exist User in system', async () => {
    const { editProfileDto, sut } = makeSut();
    jest
      .spyOn(sut['findUserByIdRepository'], 'find')
      .mockResolvedValueOnce(listUserMock[0]);
    jest
      .spyOn(sut['findUserByIdRepository'], 'find')
      .mockResolvedValueOnce({} as UserList);
    const result = await sut.execute(editProfileDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });

  it('should return EntityNotExists when a exist Logged User in system', async () => {
    const { editProfileDto, sut } = makeSut();
    jest
      .spyOn(sut['findUserByIdRepository'], 'find')
      .mockResolvedValueOnce({} as UserList);
    const result = await sut.execute(editProfileDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });

  it('should return EntityNotComplete when a not complete edit profile in system', async () => {
    const { editProfileDto, sut } = makeSut();
    jest.spyOn(sut['editProfileRepository'], 'edit').mockResolvedValueOnce('');
    const result = await sut.execute(editProfileDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotComplete);
  });
});
