import {
  EntityNotEmpty,
  FindUserByIdRepository,
  ListPlaylistCategory,
  ListPlaylistCategoryDto,
  ListPlaylistCategoryRepository,
} from '../../../../src';
import { ListPlaylistCategoryReponseMock, userMock } from '../../../entity';
import {
  FindUserByIdRepositoryMock,
  ListPlaylistCategoryRepositoryMock,
} from '../../../repository';

interface SutTypes {
  sut: ListPlaylistCategory;
  listPlaylistCategoryDto: ListPlaylistCategoryDto;
  findUserByIdRepository: FindUserByIdRepository;
  listPlaylistCategoryRepository: ListPlaylistCategoryRepository;
}

const makeSut = (): SutTypes => {
  const findUserByIdRepository = new FindUserByIdRepositoryMock();
  const listPlaylistCategoryRepository =
    new ListPlaylistCategoryRepositoryMock();

  const listPlaylistCategoryDto: ListPlaylistCategoryDto = {
    loggedUserId: userMock.userId,
    userInput: '',
  };

  const sut = new ListPlaylistCategory(
    findUserByIdRepository,
    listPlaylistCategoryRepository
  );

  return {
    findUserByIdRepository,
    listPlaylistCategoryRepository,
    listPlaylistCategoryDto,
    sut,
  };
};

describe('ListPlaylistCategory', () => {
  it('should return playlist category list when a pass correct playlist category', async () => {
    const { sut, listPlaylistCategoryDto } = makeSut();

    const result = await sut.execute(listPlaylistCategoryDto);

    expect(result.isLeft()).toBe(false);
    expect(result.isRight()).toBe(true);
    expect(result.value).toStrictEqual(ListPlaylistCategoryReponseMock);
  });

  it('should return EntityNotEmpty when a pass incorrect logged user', async () => {
    const { listPlaylistCategoryDto, sut } = makeSut();
    listPlaylistCategoryDto.loggedUserId = '';
    const result = await sut.execute(listPlaylistCategoryDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });
});
