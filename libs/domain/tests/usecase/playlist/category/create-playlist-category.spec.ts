import {
  CreatePlaylistCategory,
  CreatePlaylistCategoryDto,
  CreatePlaylistCategoryRepository,
  EntityAlreadyExists,
  EntityNotCreated,
  EntityNotEmpty,
  EntityNotExists,
  FindPlaylistCategoryByNameRepository,
  FindUserByIdRepository,
  PlaylistCategory,
  UserList,
} from '../../../../src';
import { PlaylistCategoryMock, userMock } from '../../../entity';
import {
  CreatePlaylistCategoryRepositoryMock,
  FindPlaylistCategoryByNameRepositoryMock,
  FindUserByIdRepositoryMock,
} from '../../../repository';

interface SutTypes {
  sut: CreatePlaylistCategory;
  creatPlaylistCategoryDto: CreatePlaylistCategoryDto;
  findUserByIdRepository: FindUserByIdRepository;
  createPlaylistCategoryRepository: CreatePlaylistCategoryRepository;
  findPlaylistCategoryByNameRepository: FindPlaylistCategoryByNameRepository;
}
const makeSut = (): SutTypes => {
  const findUserByIdRepository = new FindUserByIdRepositoryMock();
  const createPlaylistCategoryRepository =
    new CreatePlaylistCategoryRepositoryMock();
  const findPlaylistCategoryByNameRepository =
    new FindPlaylistCategoryByNameRepositoryMock();

  const creatPlaylistCategoryDto: CreatePlaylistCategoryDto = {
    loggedUserId: userMock.userId,
    body: {
      description: PlaylistCategoryMock.description,
      name: PlaylistCategoryMock.name,
    },
  };

  const sut = new CreatePlaylistCategory(
    findUserByIdRepository,
    createPlaylistCategoryRepository,
    findPlaylistCategoryByNameRepository
  );

  return {
    findUserByIdRepository,
    createPlaylistCategoryRepository,
    findPlaylistCategoryByNameRepository,
    creatPlaylistCategoryDto,
    sut,
  };
};

describe('CreatePlaylistCategory', () => {
  it('should return playlist category id when a correct playlist category created in database', async () => {
    const { sut, creatPlaylistCategoryDto } = makeSut();

    const result = await sut.execute(creatPlaylistCategoryDto);

    expect(result.isLeft()).toBe(false);
    expect(result.isRight()).toBe(true);
    expect(result.value).toStrictEqual(PlaylistCategoryMock.id);
  });

  it('should return EntityNotEmpty when a pass incorrect logged user', async () => {
    const { creatPlaylistCategoryDto, sut } = makeSut();
    creatPlaylistCategoryDto.loggedUserId = '';
    const result = await sut.execute(creatPlaylistCategoryDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when a pass incorrect name', async () => {
    const { creatPlaylistCategoryDto, sut } = makeSut();
    creatPlaylistCategoryDto.body.name = '';
    const result = await sut.execute(creatPlaylistCategoryDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when a pass incorrect description', async () => {
    const { creatPlaylistCategoryDto, sut } = makeSut();
    creatPlaylistCategoryDto.body.description = '';
    const result = await sut.execute(creatPlaylistCategoryDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotExists if there is no user created in the database', async () => {
    const {
      creatPlaylistCategoryDto,
      createPlaylistCategoryRepository,
      findPlaylistCategoryByNameRepository,
    } = makeSut();

    const mockEmptyItem = {} as UserList;

    const mockEmptyRepository: FindUserByIdRepository = {
      find: jest.fn(async () => mockEmptyItem),
    };

    const sut = new CreatePlaylistCategory(
      mockEmptyRepository,
      createPlaylistCategoryRepository,
      findPlaylistCategoryByNameRepository
    );

    const result = await sut.execute(creatPlaylistCategoryDto);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });

  it('should return EntityNotCreated if there is no playlist category created in the database', async () => {
    const {
      creatPlaylistCategoryDto,
      findUserByIdRepository,
      findPlaylistCategoryByNameRepository,
    } = makeSut();

    const mockEmptyRepository: CreatePlaylistCategoryRepository = {
      create: jest.fn(async () => ''),
    };

    const sut = new CreatePlaylistCategory(
      findUserByIdRepository,
      mockEmptyRepository,
      findPlaylistCategoryByNameRepository
    );

    const result = await sut.execute(creatPlaylistCategoryDto);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotCreated);
  });

  it('should return EntityAlreadyExists if there is playlist category created in the database', async () => {
    const {
      creatPlaylistCategoryDto,
      findUserByIdRepository,
      createPlaylistCategoryRepository,
    } = makeSut();

    const mockEmptyRepository: FindPlaylistCategoryByNameRepository = {
      find: jest.fn(async () => PlaylistCategoryMock),
    };

    const sut = new CreatePlaylistCategory(
      findUserByIdRepository,
      createPlaylistCategoryRepository,
      mockEmptyRepository
    );

    const result = await sut.execute(creatPlaylistCategoryDto);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityAlreadyExists);
  });
});
