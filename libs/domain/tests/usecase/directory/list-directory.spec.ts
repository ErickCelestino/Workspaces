import {
  FindUserByIdRepository,
  ListDirectory,
  ListDirectoryDto,
  ListDirectoryRepository,
} from '../../../src';
import { userMock } from '../../entity';
import {
  FindUserByIdRepositoryMock,
  ListDirectoryRepositoryMock,
} from '../../repository';

interface SutTypes {
  sut: ListDirectory;
  listDirectoryDto: ListDirectoryDto;
  findUserByIdRepository: FindUserByIdRepository;
  listDirectoryRepository: ListDirectoryRepository;
}

const makeSut = (): SutTypes => {
  const findUserByIdRepository = new FindUserByIdRepositoryMock();
  const listDirectoryRepository = new ListDirectoryRepositoryMock();

  const listDirectoryDto: ListDirectoryDto = {
    loggedUserId: userMock.userId,
    userInput: '',
  };

  const sut = new ListDirectory(
    findUserByIdRepository,
    listDirectoryRepository
  );

  return {
    findUserByIdRepository,
    listDirectoryRepository,
    listDirectoryDto,
    sut,
  };
};

describe('ListDirectory', () => {
  it('should return directory list when a correct input data', async () => {
    const { sut, listDirectoryDto } = makeSut();

    const result = await sut.execute(listDirectoryDto);

    expect(result.isLeft()).toBe(false);
    expect(result.isRight()).toBe(true);
  });

  it('should return EntityNotEmpty when a pass incorrect Logged User ID', async () => {
    const { listDirectoryDto, sut } = makeSut();
    listDirectoryDto.loggedUserId = '';
    const result = await sut.execute(listDirectoryDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
  });
});
