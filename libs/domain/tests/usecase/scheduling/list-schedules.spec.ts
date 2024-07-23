import {
  FindUserByIdRepositoryMock,
  ListSchedulesRepositoryMock,
} from '../../repository';
import {
  ListSchedulesRepository,
  FindUserByIdRepository,
  ListSchedulesDto,
  EntityNotEmpty,
  ListSchedules,
} from '../../../src';
import { ListSchedulesReponseMock, userMock } from '../../entity';

interface SutTypes {
  sut: ListSchedules;
  listSchedulingDto: ListSchedulesDto;
  findUserByIdRepository: FindUserByIdRepository;
  listSchedulingRepository: ListSchedulesRepository;
}

const makeSut = (): SutTypes => {
  const findUserByIdRepository = new FindUserByIdRepositoryMock();
  const listSchedulingRepository = new ListSchedulesRepositoryMock();

  const listSchedulingDto: ListSchedulesDto = {
    loggedUserId: userMock.userId,
    filter: '',
  };

  const sut = new ListSchedules(
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
    expect(result.value).toStrictEqual(ListSchedulesReponseMock);
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