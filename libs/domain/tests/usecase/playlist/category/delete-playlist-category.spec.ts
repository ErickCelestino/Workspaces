import {
  EntityNotEmpty,
  EntityNotExists,
  FindPlaylistCategoryByIdRepository,
  PlaylistCategory,
  UserList,
} from '../../../../src';
import {
  DeletePlaylistCategory,
  DeletePlaylistCategoryDto,
  DeletePlaylistCategoryRepository,
  FindUserByIdRepository,
} from '../../../../src';
import { PlaylistCategoryMock, userMock } from '../../../entity';
import {
  DeletePlaylistCategoryRepositoryMock,
  FindPlaylistCategoryByIdRepositoryMock,
  FindUserByIdRepositoryMock,
} from '../../../repository';

interface SutTypes {
  sut: DeletePlaylistCategory;
  deletePlaylistCategoryDto: DeletePlaylistCategoryDto;
  findUserRepository: FindUserByIdRepository;
  findPlaylistCategoryRepository: FindPlaylistCategoryByIdRepository;
  deletePlaylistCategoryRepository: DeletePlaylistCategoryRepository;
}

const makeSut = (): SutTypes => {
  const findUserRepository = new FindUserByIdRepositoryMock();
  const findPlaylistCategoryRepository =
    new FindPlaylistCategoryByIdRepositoryMock();
  const deletePlaylistCategoryRepository =
    new DeletePlaylistCategoryRepositoryMock();
  const deletePlaylistCategoryDto: DeletePlaylistCategoryDto = {
    id: PlaylistCategoryMock.id,
    loggedUserId: userMock.userId,
  };

  const sut = new DeletePlaylistCategory(
    findUserRepository,
    findPlaylistCategoryRepository,
    deletePlaylistCategoryRepository
  );

  return {
    findPlaylistCategoryRepository,
    deletePlaylistCategoryRepository,
    findUserRepository,
    deletePlaylistCategoryDto,
    sut,
  };
};

describe('DeletePlaylistCategory', () => {
  it('should return void if deletected playlist category in system', async () => {
    const { deletePlaylistCategoryDto, sut } = makeSut();

    const result = await sut.execute(deletePlaylistCategoryDto);

    expect(result.isLeft()).toBe(false);
    expect(result.isRight()).toBe(true);
    expect(result.value).toStrictEqual(undefined);
  });

  it('should return EntityNotEmpty when a pass incorrect logged user', async () => {
    const { deletePlaylistCategoryDto, sut } = makeSut();
    deletePlaylistCategoryDto.loggedUserId = '';
    const result = await sut.execute(deletePlaylistCategoryDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when a pass incorrect ID', async () => {
    const { deletePlaylistCategoryDto, sut } = makeSut();
    deletePlaylistCategoryDto.id = '';
    const result = await sut.execute(deletePlaylistCategoryDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotExists if there is no user created in the database', async () => {
    const {
      deletePlaylistCategoryDto,
      deletePlaylistCategoryRepository,
      findPlaylistCategoryRepository,
    } = makeSut();

    const mockEmptyItem = {} as UserList;

    const mockEmptyRepository: FindUserByIdRepository = {
      find: jest.fn(async () => mockEmptyItem),
    };

    const sut = new DeletePlaylistCategory(
      mockEmptyRepository,
      findPlaylistCategoryRepository,
      deletePlaylistCategoryRepository
    );

    const result = await sut.execute(deletePlaylistCategoryDto);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });

  it('should return EntityNotExists if there is no playlist category created in the database', async () => {
    const {
      deletePlaylistCategoryDto,
      findUserRepository,
      deletePlaylistCategoryRepository,
    } = makeSut();

    const mockEmptyItem = {} as PlaylistCategory;

    const mockEmptyRepository: FindPlaylistCategoryByIdRepository = {
      find: jest.fn(async () => mockEmptyItem),
    };

    const sut = new DeletePlaylistCategory(
      findUserRepository,
      mockEmptyRepository,
      deletePlaylistCategoryRepository
    );

    const result = await sut.execute(deletePlaylistCategoryDto);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });
});
