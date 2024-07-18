import {
  ConvertStringInTimeRepository,
  CreateScheduling,
  CreateSchedulingDto,
  CreateSchedulingRepository,
  EntityAlreadyExists,
  EntityNotConverted,
  EntityNotCreated,
  EntityNotEmpty,
  EntityNotNegativeNumber,
  FindSchedulingByNameRepository,
  FindUserByIdRepository,
  StartTimeCannotBeGreaterEndTime,
} from '../../../src';
import { SchedulingMock, userMock } from '../../entity';
import {
  ConvertStringInTimeRepositoryMock,
  CreateSchedulingRepositoryMock,
  FindSchedulingByNameRepositoryMock,
  FindUserByIdRepositoryMock,
} from '../../repository';

interface SutTypes {
  sut: CreateScheduling;
  createSchedulingDto: CreateSchedulingDto;
  findUserByIdRepository: FindUserByIdRepository;
  findSchedulingByNameRepository: FindSchedulingByNameRepository;
  convertStringInTimeRepository: ConvertStringInTimeRepository;
  createSchedulingRepository: CreateSchedulingRepository;
}

const makeSut = (): SutTypes => {
  const findUserByIdRepository = new FindUserByIdRepositoryMock();
  const findSchedulingByNameRepository =
    new FindSchedulingByNameRepositoryMock();
  const convertStringInTimeRepository = new ConvertStringInTimeRepositoryMock();
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
    convertStringInTimeRepository,
    createSchedulingRepository
  );

  return {
    sut,
    createSchedulingDto,
    findUserByIdRepository,
    convertStringInTimeRepository,
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
      convertStringInTimeRepository,
    } = makeSut();

    const mockEmptyRepository: FindSchedulingByNameRepository = {
      find: jest.fn(async () => SchedulingMock),
    };

    const sut = new CreateScheduling(
      findUserByIdRepository,
      mockEmptyRepository,
      convertStringInTimeRepository,
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
      convertStringInTimeRepository,
    } = makeSut();

    const mockEmptyRepository: CreateSchedulingRepository = {
      create: jest.fn(async () => ''),
    };

    const sut = new CreateScheduling(
      findUserByIdRepository,
      findSchedulingByNameRepository,
      convertStringInTimeRepository,
      mockEmptyRepository
    );

    const result = await sut.execute(createSchedulingDto);

    expect(result.isRight()).toBe(false);
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotCreated);
  });

  it('should return StartTimeCannotBeGreaterEndTime when a pass greater Start Time', async () => {
    const { sut, createSchedulingDto } = makeSut();

    jest
      .spyOn(sut['convertStringInTimeRepository'], 'convert')
      .mockResolvedValueOnce(new Date('2021-10-10T10:00:00'));
    jest
      .spyOn(sut['convertStringInTimeRepository'], 'convert')
      .mockResolvedValueOnce(new Date('2021-10-10T09:00:00'));

    const result = await sut.execute(createSchedulingDto);

    expect(result.isRight()).toBe(false);
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(StartTimeCannotBeGreaterEndTime);
  });

  it('should return EntityNotConverted when not converted start time or end time in system', async () => {
    const {
      createSchedulingDto,
      findUserByIdRepository,
      findSchedulingByNameRepository,
      createSchedulingRepository,
    } = makeSut();

    const mockEmptyRepository: ConvertStringInTimeRepository = {
      convert: jest.fn(async () => new Date(NaN)),
    };

    const sut = new CreateScheduling(
      findUserByIdRepository,
      findSchedulingByNameRepository,
      mockEmptyRepository,
      createSchedulingRepository
    );

    const result = await sut.execute(createSchedulingDto);

    expect(result.isRight()).toBe(false);
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotConverted);
  });
});
