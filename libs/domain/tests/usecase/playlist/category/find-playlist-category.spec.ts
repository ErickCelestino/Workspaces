import {
  EntityNotEmpty,
  EntityNotExists,
  FindPlaylistCategoryById,
  FindPlaylistCategoryByIdDto,
  FindPlaylistCategoryByIdRepository,
  FindUserByIdRepository,
  PlaylistCategory,
  UserList,
} from '../../../../src';
import { PlaylistCategoryMock, userMock } from '../../../entity';
import {
  FindPlaylistCategoryByIdRepositoryMock,
  FindUserByIdRepositoryMock,
} from '../../../repository';

interface SutTypes {
  sut: FindPlaylistCategoryById;
  findPlaylistCategoryByIdDto: FindPlaylistCategoryByIdDto;
  findUserByIdRepository: FindUserByIdRepository;
  findPlaylistCategoryByIdRepository: FindPlaylistCategoryByIdRepository;
}

const makeSut = (): SutTypes => {
  const findUserByIdRepository = new FindUserByIdRepositoryMock();
  const findPlaylistCategoryByIdRepository =
    new FindPlaylistCategoryByIdRepositoryMock();

  const findPlaylistCategoryByIdDto: FindPlaylistCategoryByIdDto = {
    loggedUserId: userMock.userId,
    id: PlaylistCategoryMock.id,
  };

  const sut = new FindPlaylistCategoryById(
    findUserByIdRepository,
    findPlaylistCategoryByIdRepository
  );

  return {
    findUserByIdRepository,
    findPlaylistCategoryByIdRepository,
    findPlaylistCategoryByIdDto,
    sut,
  };
};

describe('FindPlaylistCategoryById', () => {
  it('should return PlaylistCategory when pass conrrect data', async () => {
    const { sut, findPlaylistCategoryByIdDto } = makeSut();

    const result = await sut.execute(findPlaylistCategoryByIdDto);

    expect(result.isLeft()).toBe(false);
    expect(result.isRight()).toBe(true);
    expect(result.value).toStrictEqual(PlaylistCategoryMock);
  });

  it('should return EntityNotEmpty when a pass incorrect logged user ID', async () => {
    const { findPlaylistCategoryByIdDto, sut } = makeSut();
    findPlaylistCategoryByIdDto.loggedUserId = '';
    const result = await sut.execute(findPlaylistCategoryByIdDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when a pass incorrect ID', async () => {
    const { findPlaylistCategoryByIdDto, sut } = makeSut();
    findPlaylistCategoryByIdDto.id = '';
    const result = await sut.execute(findPlaylistCategoryByIdDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotExists if there is no user created in the database', async () => {
    const { findPlaylistCategoryByIdDto, findPlaylistCategoryByIdRepository } =
      makeSut();

    const mockEmptyItem = {} as UserList;

    const mockEmptyRepository: FindUserByIdRepository = {
      find: jest.fn(async () => mockEmptyItem),
    };

    const sut = new FindPlaylistCategoryById(
      mockEmptyRepository,
      findPlaylistCategoryByIdRepository
    );

    const result = await sut.execute(findPlaylistCategoryByIdDto);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });

  it('should return EntityNotExists if there is no playlist category created in the database', async () => {
    const { findPlaylistCategoryByIdDto, findUserByIdRepository } = makeSut();

    const mockEmptyItem = {} as PlaylistCategory;

    const mockEmptyRepository: FindPlaylistCategoryByIdRepository = {
      find: jest.fn(async () => mockEmptyItem),
    };

    const sut = new FindPlaylistCategoryById(
      findUserByIdRepository,
      mockEmptyRepository
    );

    const result = await sut.execute(findPlaylistCategoryByIdDto);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });
});
