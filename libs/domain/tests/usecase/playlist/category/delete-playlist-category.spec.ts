import { EntityNotEmpty, EntityNotExists, UserList } from '../../../../src';
import {
  DeletePlaylistCategory,
  DeletePlaylistCategoryDto,
  DeletePlaylistCategoryRepository,
  FindUserByIdRepository,
} from '../../../../src';
import { PlaylistCategoryMock, userMock } from '../../../entity';
import {
  DeletePlaylistCategoryRepositoryMock,
  FindUserByIdRepositoryMock,
} from '../../../repository';

interface SutTypes {
  sut: DeletePlaylistCategory;
  deletePlaylistCategoryDto: DeletePlaylistCategoryDto;
  findUserRepository: FindUserByIdRepository;
  deletePlaylistCategoryRepository: DeletePlaylistCategoryRepository;
}

const makeSut = (): SutTypes => {
  const findUserRepository = new FindUserByIdRepositoryMock();
  const deletePlaylistCategoryRepository =
    new DeletePlaylistCategoryRepositoryMock();
  const deletePlaylistCategoryDto: DeletePlaylistCategoryDto = {
    id: PlaylistCategoryMock.id,
    loggedUserId: userMock.userId,
  };

  const sut = new DeletePlaylistCategory(
    findUserRepository,
    deletePlaylistCategoryRepository
  );

  return {
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
    const { deletePlaylistCategoryDto, deletePlaylistCategoryRepository } =
      makeSut();

    const mockEmptyItem = {} as UserList;

    const mockEmptyRepository: FindUserByIdRepository = {
      find: jest.fn(async () => mockEmptyItem),
    };

    const sut = new DeletePlaylistCategory(
      mockEmptyRepository,
      deletePlaylistCategoryRepository
    );

    const result = await sut.execute(deletePlaylistCategoryDto);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });
});
