import {
  FindUserByIdRepositoryMock,
  ListSchedulingRepositoryMock,
} from '../../repository';
import {
  ListSchedulingRepository,
  ListScheduling,
  FindUserByIdRepository,
  ListSchedulingDto,
  EntityNotEmpty,
} from '../../../src';
import { ListSchedulingReponseMock, userMock } from '../../entity';

interface SutTypes {
  sut: ListScheduling;
  listSchedulingDto: ListSchedulingDto;
  findUserByIdRepository: FindUserByIdRepository;
  listSchedulingRepository: ListSchedulingRepository;
}

const makeSut = (): SutTypes => {
  const findUserByIdRepository = new FindUserByIdRepositoryMock();
  const listSchedulingRepository = new ListSchedulingRepositoryMock();

  const listSchedulingDto: ListSchedulingDto = {
    loggedUserId: userMock.userId,
    filter: '',
  };

  const sut = new ListScheduling(
    findUserByIdRepository,
    listSchedulingRepository
  );

  return {
    findUserByIdRepository,
    listSchedulingRepository,
    listSchedulingDto,
    sut,
  };
};

describe('ListScheduling', () => {
  it('should return ListSchedulingReponseMock  when a pass correct listSchedulingDto', async () => {
    const { sut, listSchedulingDto } = makeSut();

    const result = await sut.execute(listSchedulingDto);

    expect(result.isRight()).toBe(true);
    expect(result.isLeft()).toBe(false);
    expect(result.value).toStrictEqual(ListSchedulingReponseMock);
  });

  it('should return EntityNotEmpty  when a pass incorrect User ID', async () => {
    const { sut, listSchedulingDto } = makeSut();
    listSchedulingDto.loggedUserId = '';
    const result = await sut.execute(listSchedulingDto);

    expect(result.isRight()).toBe(false);
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });
});
