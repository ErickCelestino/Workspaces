import {
  DeleteScheduling,
  DeleteSchedulingDto,
  DeleteSchedulingRepository,
  FindSchedulingByIdRepository,
  FindUserByIdRepository,
  EntityNotEmpty,
} from '../../../src';
import { SchedulingMock, userMock } from '../../entity';
import {
  DeleteSchedulingRepositoryMock,
  FindSchedulingByIdRepositoryMock,
  FindUserByIdRepositoryMock,
} from '../../repository';

interface SutTypes {
  sut: DeleteScheduling;
  deleteSchedulingDto: DeleteSchedulingDto;
  findUserByIdRepository: FindUserByIdRepository;
  findScheduleByIdRepository: FindSchedulingByIdRepository;
  deleteSchedulingRepository: DeleteSchedulingRepository;
}

const makeSut = (): SutTypes => {
  const findUserByIdRepository = new FindUserByIdRepositoryMock();
  const findScheduleByIdRepository = new FindSchedulingByIdRepositoryMock();
  const deleteSchedulingRepository = new DeleteSchedulingRepositoryMock();

  const deleteSchedulingDto: DeleteSchedulingDto = {
    id: SchedulingMock.id,
    loggedUserId: userMock.userId,
  };

  const sut = new DeleteScheduling(
    findUserByIdRepository,
    findScheduleByIdRepository,
    deleteSchedulingRepository
  );

  return {
    sut,
    deleteSchedulingDto,
    findUserByIdRepository,
    findScheduleByIdRepository,
    deleteSchedulingRepository,
  };
};

describe('DeleteScheduling', () => {
  it('should return undefined when delete scheduling and pass correct DeleteSchedulingDto', async () => {
    const { sut, deleteSchedulingDto } = makeSut();

    const result = await sut.execute(deleteSchedulingDto);

    expect(result.isLeft()).toBe(false);
    expect(result.isRight()).toBe(true);
    expect(result.value).toStrictEqual(undefined);
  });

  it('should return EntityNotEmpty when pass incorrect Scheduling ID', async () => {
    const { sut, deleteSchedulingDto } = makeSut();
    deleteSchedulingDto.id = '';
    const result = await sut.execute(deleteSchedulingDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when pass incorrect User ID', async () => {
    const { sut, deleteSchedulingDto } = makeSut();
    deleteSchedulingDto.loggedUserId = '';
    const result = await sut.execute(deleteSchedulingDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });
});