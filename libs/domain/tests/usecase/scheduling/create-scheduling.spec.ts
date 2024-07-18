import {
  CreateScheduling,
  CreateSchedulingDto,
  CreateSchedulingRepository,
  EntityAlreadyExists,
  EntityNotCreated,
  EntityNotEmpty,
  EntityNotNegativeNumber,
  FindSchedulingByNameRepository,
  FindUserByIdRepository,
} from '../../../src';
import { SchedulingMock, userMock } from '../../entity';
import {
  CreateSchedulingRepositoryMock,
  FindSchedulingByNameRepositoryMock,
  FindUserByIdRepositoryMock,
} from '../../repository';

interface SutTypes {
  sut: CreateScheduling;
  createSchedulingDto: CreateSchedulingDto;
  findUserByIdRepository: FindUserByIdRepository;
  findSchedulingByNameRepository: FindSchedulingByNameRepository;
  createSchedulingRepository: CreateSchedulingRepository;
}

const makeSut = (): SutTypes => {
  const findUserByIdRepository = new FindUserByIdRepositoryMock();
  const findSchedulingByNameRepository =
    new FindSchedulingByNameRepositoryMock();
  const createSchedulingRepository = new CreateSchedulingRepositoryMock();

  const createSchedulingDto: CreateSchedulingDto = {
    loggedUserId: userMock.userId,
    body: {
      name: SchedulingMock.name,
      lopping: SchedulingMock.lopping,
      priority: SchedulingMock.priority,
      startTime: SchedulingMock.startTime,
      endTime: SchedulingMock.endTime,
    },
  };

  const sut = new CreateScheduling(
    findUserByIdRepository,
    findSchedulingByNameRepository,
    createSchedulingRepository
  );

  return {
    sut,
    createSchedulingDto,
    findUserByIdRepository,
    findSchedulingByNameRepository,
    createSchedulingRepository,
  };
};

describe('CreateScheduling', () => {
  it('should return Scheduling ID when a pass correct createSchedulingDto', async () => {
    const { sut, createSchedulingDto } = makeSut();

    const result = await sut.execute(createSchedulingDto);

    expect(result.isRight()).toBe(true);
    expect(result.isLeft()).toBe(false);
    expect(result.value).toStrictEqual(SchedulingMock.id);
  });

  it('should return EntityNotEmpty when a pass incorrect Logged User ID', async () => {
    const { sut, createSchedulingDto } = makeSut();
    createSchedulingDto.loggedUserId = '';
    const result = await sut.execute(createSchedulingDto);

    expect(result.isRight()).toBe(false);
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when a pass incorrect Name', async () => {
    const { sut, createSchedulingDto } = makeSut();
    createSchedulingDto.body.name = '';
    const result = await sut.execute(createSchedulingDto);

    expect(result.isRight()).toBe(false);
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when a pass incorrect End Time', async () => {
    const { sut, createSchedulingDto } = makeSut();
    createSchedulingDto.body.endTime = '';
    const result = await sut.execute(createSchedulingDto);

    expect(result.isRight()).toBe(false);
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when a pass incorrect Start Time', async () => {
    const { sut, createSchedulingDto } = makeSut();
    createSchedulingDto.body.startTime = '';
    const result = await sut.execute(createSchedulingDto);

    expect(result.isRight()).toBe(false);
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotNegativeNumber when a pass incorrect Priority', async () => {
    const { sut, createSchedulingDto } = makeSut();
    createSchedulingDto.body.priority = -1;
    const result = await sut.execute(createSchedulingDto);

    expect(result.isRight()).toBe(false);
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotNegativeNumber);
  });

  it('should return EntityAlreadyExists when a exist scheduling in database', async () => {
    const {
      createSchedulingRepository,
      findUserByIdRepository,
      createSchedulingDto,
    } = makeSut();

    const mockEmptyRepository: FindSchedulingByNameRepository = {
      find: jest.fn(async () => SchedulingMock),
    };

    const sut = new CreateScheduling(
      findUserByIdRepository,
      mockEmptyRepository,
      createSchedulingRepository
    );

    const result = await sut.execute(createSchedulingDto);

    expect(result.isRight()).toBe(false);
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityAlreadyExists);
  });

  it('should return EntityNotCreated when not created Scheduling in database', async () => {
    const {
      createSchedulingDto,
      findUserByIdRepository,
      findSchedulingByNameRepository,
    } = makeSut();

    const mockEmptyRepository: CreateSchedulingRepository = {
      create: jest.fn(async () => ''),
    };

    const sut = new CreateScheduling(
      findUserByIdRepository,
      findSchedulingByNameRepository,
      mockEmptyRepository
    );

    const result = await sut.execute(createSchedulingDto);

    expect(result.isRight()).toBe(false);
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotCreated);
  });
});
