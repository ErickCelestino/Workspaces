import {
  EntityNotEmpty,
  FindUserByIdRepository,
  ListSimpleDirectory,
  ListSimpleDirectoryDto,
  ListSimpleDirectoryRepository,
} from '../../../src';
import { ListSimpleDirectoryResponseDtoMock, userMock } from '../../entity';
import {
  FindUserByIdRepositoryMock,
  ListSimpleDirectoryRespositoryMock,
} from '../../repository';

interface SutTypes {
  sut: ListSimpleDirectory;
  listSimpleDirectoryDto: ListSimpleDirectoryDto;
  findUserByIdRepository: FindUserByIdRepository;
  listSimpleDirectoryRepository: ListSimpleDirectoryRepository;
}

const makeSut = (): SutTypes => {
  const findUserByIdRepository = new FindUserByIdRepositoryMock();
  const listSimpleDirectoryRepository =
    new ListSimpleDirectoryRespositoryMock();

  const listSimpleDirectoryDto: ListSimpleDirectoryDto = {
    loggedUserId: userMock.userId,
    userInput: '',
  };

  const sut = new ListSimpleDirectory(
    findUserByIdRepository,
    listSimpleDirectoryRepository
  );

  return {
    findUserByIdRepository,
    listSimpleDirectoryRepository,
    listSimpleDirectoryDto,
    sut,
  };
};

describe('ListSimpleDirectory', () => {
  it('should return ListSimpleDirectoryResponseDto when a correct pass data', async () => {
    const { sut, listSimpleDirectoryDto } = makeSut();

    const result = await sut.execute(listSimpleDirectoryDto);

    expect(result.isLeft()).toBe(false);
    expect(result.isRight()).toBe(true);
    expect(result.value).toStrictEqual(ListSimpleDirectoryResponseDtoMock);
  });

  it('should return EntityNotEmpty when a pass incorrect logged user id', async () => {
    const { listSimpleDirectoryDto, sut } = makeSut();
    listSimpleDirectoryDto.loggedUserId = '';
    const result = await sut.execute(listSimpleDirectoryDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });
});
