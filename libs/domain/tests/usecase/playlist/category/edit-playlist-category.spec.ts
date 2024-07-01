import {
  EditPlaylistCategory,
  EditPlaylistCategoryRepository,
  FindPlaylistCategoryByIdRepository,
  FindUserByIdRepository,
  EntityNotEmpty,
  UserList,
  EntityNotExists,
  PlaylistCategory,
} from '../../../../src';
import { EditPlaylistCategoryDto } from '../../../../src/lib/dto/request/playlist/category/edit-playlist-category.dto';
import { PlaylistCategoryMock, userMock } from '../../../entity';
import {
  EditPlaylistCategoryRepositoryMock,
  FindPlaylistCategoryByIdRepositoryMock,
  FindUserByIdRepositoryMock,
} from '../../../repository';

interface SutTypes {
  sut: EditPlaylistCategory;
  editPlaylistCategoryDto: EditPlaylistCategoryDto;
  findUserByIdRepository: FindUserByIdRepository;
  findPlaylistCategoryByIdRepository: FindPlaylistCategoryByIdRepository;
  editPlaylistCategoryRespository: EditPlaylistCategoryRepository;
}

const makeSut = (): SutTypes => {
  const findUserByIdRepository = new FindUserByIdRepositoryMock();
  const findPlaylistCategoryByIdRepository =
    new FindPlaylistCategoryByIdRepositoryMock();
  const editPlaylistCategoryRespository =
    new EditPlaylistCategoryRepositoryMock();

  const editPlaylistCategoryDto: EditPlaylistCategoryDto = {
    id: PlaylistCategoryMock.id,
    body: {
      name: PlaylistCategoryMock.name,
      description: PlaylistCategoryMock.description,
    },
    loggedUserId: userMock.userId,
  };

  const sut = new EditPlaylistCategory(
    findUserByIdRepository,
    findPlaylistCategoryByIdRepository,
    editPlaylistCategoryRespository
  );

  return {
    findUserByIdRepository,
    findPlaylistCategoryByIdRepository,
    editPlaylistCategoryRespository,
    editPlaylistCategoryDto,
    sut,
  };
};

describe('EditPlaylistCategory', () => {
  it('should return void when a pass correct edit playlist category data', async () => {
    const { sut, editPlaylistCategoryDto } = makeSut();

    const result = await sut.execute(editPlaylistCategoryDto);

    expect(result.isLeft()).toBe(false);
    expect(result.isRight()).toBe(true);
    expect(result.value).toStrictEqual(undefined);
  });

  it('should return EntityNotEmpty when a pass incorrect logged user', async () => {
    const { editPlaylistCategoryDto, sut } = makeSut();
    editPlaylistCategoryDto.loggedUserId = '';
    const result = await sut.execute(editPlaylistCategoryDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when a pass incorrect ID', async () => {
    const { editPlaylistCategoryDto, sut } = makeSut();
    editPlaylistCategoryDto.id = '';
    const result = await sut.execute(editPlaylistCategoryDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when a pass incorrect name', async () => {
    const { editPlaylistCategoryDto, sut } = makeSut();
    editPlaylistCategoryDto.body.name = '';
    const result = await sut.execute(editPlaylistCategoryDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when a pass incorrect description', async () => {
    const { editPlaylistCategoryDto, sut } = makeSut();
    editPlaylistCategoryDto.body.description = '';
    const result = await sut.execute(editPlaylistCategoryDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotExists if there is no user created in the database', async () => {
    const {
      editPlaylistCategoryDto,
      editPlaylistCategoryRespository,
      findPlaylistCategoryByIdRepository,
    } = makeSut();

    const mockEmptyItem = {} as UserList;

    const mockEmptyRepository: FindUserByIdRepository = {
      find: jest.fn(async () => mockEmptyItem),
    };

    const sut = new EditPlaylistCategory(
      mockEmptyRepository,
      findPlaylistCategoryByIdRepository,
      editPlaylistCategoryRespository
    );

    const result = await sut.execute(editPlaylistCategoryDto);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });

  it('should return EntityNotExists if there is no playlist category created in the database', async () => {
    const {
      editPlaylistCategoryDto,
      editPlaylistCategoryRespository,
      findUserByIdRepository,
    } = makeSut();

    const mockEmptyItem = {} as PlaylistCategory;

    const mockEmptyRepository: FindPlaylistCategoryByIdRepository = {
      find: jest.fn(async () => mockEmptyItem),
    };

    const sut = new EditPlaylistCategory(
      findUserByIdRepository,
      mockEmptyRepository,
      editPlaylistCategoryRespository
    );

    const result = await sut.execute(editPlaylistCategoryDto);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });
});
