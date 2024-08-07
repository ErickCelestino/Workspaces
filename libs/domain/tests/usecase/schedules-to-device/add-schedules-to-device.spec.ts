import {
  AddSchedulesToDevice,
  AddSchedulesToDeviceDto,
  AddSchedulingToDeviceRepository,
  Device,
  EntityNotCreated,
  EntityNotEmpty,
  EntityNotExists,
  FindDeviceByIdRepository,
  FindSchedulingByIdRepository,
  FindUserByIdRepository,
  Scheduling,
  UserList,
} from '../../../src';
import {
  DeviceMock,
  SchedulesToDeviceMock,
  SchedulingMock,
  userMock,
} from '../../entity';
import {
  AddSchedulingToDeviceRepositoryMock,
  FindDeviceByIdRepositoryMock,
  FindSchedulingByIdRepositoryMock,
  FindUserByIdRepositoryMock,
} from '../../repository';

interface SutTypes {
  sut: AddSchedulesToDevice;
  addSchedulesToDeviceDto: AddSchedulesToDeviceDto;
  findUserByIdRepository: FindUserByIdRepository;
  findDeviceByIdRepository: FindDeviceByIdRepository;
  findSchedulingByIdRepository: FindSchedulingByIdRepository;
  addSchedulingToDeviceRepository: AddSchedulingToDeviceRepository;
}

const makeSut = (): SutTypes => {
  const findUserByIdRepository = new FindUserByIdRepositoryMock();
  const findDeviceByIdRepository = new FindDeviceByIdRepositoryMock();
  const findSchedulingByIdRepository = new FindSchedulingByIdRepositoryMock();
  const addSchedulingToDeviceRepository =
    new AddSchedulingToDeviceRepositoryMock();

  const addSchedulesToDeviceDto: AddSchedulesToDeviceDto = {
    idDevice: DeviceMock.id,
    loggedUserId: userMock.userId,
    schedulesIds: [SchedulingMock.id],
  };

  const sut = new AddSchedulesToDevice(
    findUserByIdRepository,
    findDeviceByIdRepository,
    findSchedulingByIdRepository,
    addSchedulingToDeviceRepository
  );

  return {
    sut,
    addSchedulesToDeviceDto,
    findUserByIdRepository,
    findDeviceByIdRepository,
    findSchedulingByIdRepository,
    addSchedulingToDeviceRepository,
  };
};

describe('AddSchedulesToDevice', () => {
  it('should return device and scheduling ID when pass correct AddSchedulesToDeviceDto', async () => {
    const { sut, addSchedulesToDeviceDto } = makeSut();

    const result = await sut.execute(addSchedulesToDeviceDto);

    expect(result.isRight()).toBe(true);
    expect(result.isLeft()).toBe(false);
    expect(result.value).toStrictEqual([SchedulesToDeviceMock.id]);
  });

  it('should return EntityNotEmpty when pass correct Logged User ID', async () => {
    const { sut, addSchedulesToDeviceDto } = makeSut();
    addSchedulesToDeviceDto.loggedUserId = '';
    const result = await sut.execute(addSchedulesToDeviceDto);

    expect(result.isRight()).toBe(false);
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when pass correct Device ID', async () => {
    const { sut, addSchedulesToDeviceDto } = makeSut();
    addSchedulesToDeviceDto.idDevice = '';
    const result = await sut.execute(addSchedulesToDeviceDto);

    expect(result.isRight()).toBe(false);
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when pass correct Schedules', async () => {
    const { sut, addSchedulesToDeviceDto } = makeSut();
    addSchedulesToDeviceDto.schedulesIds = [];
    const result = await sut.execute(addSchedulesToDeviceDto);

    expect(result.isRight()).toBe(false);
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when pass correct Scheduling ID', async () => {
    const { sut, addSchedulesToDeviceDto } = makeSut();
    addSchedulesToDeviceDto.schedulesIds[0] = '';
    const result = await sut.execute(addSchedulesToDeviceDto);

    expect(result.isRight()).toBe(false);
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityAlreadyExists when a exist User in system', async () => {
    const { addSchedulesToDeviceDto, sut } = makeSut();
    jest
      .spyOn(sut['findUserByIdRepository'], 'find')
      .mockResolvedValueOnce({} as UserList);
    const result = await sut.execute(addSchedulesToDeviceDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });

  it('should return EntityAlreadyExists when a exist device in system', async () => {
    const { addSchedulesToDeviceDto, sut } = makeSut();
    jest
      .spyOn(sut['findDeviceByIdRepository'], 'find')
      .mockResolvedValueOnce({} as Device);
    const result = await sut.execute(addSchedulesToDeviceDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });

  it('should return EntityNotExists when a pass incorrect Scheduling ID', async () => {
    const { addSchedulesToDeviceDto, sut } = makeSut();
    jest
      .spyOn(sut['findSchedulingByIdRepository'], 'find')
      .mockResolvedValueOnce({} as Scheduling);
    const result = await sut.execute(addSchedulesToDeviceDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });

  it('should return EntityNotCreated when a not created scheduling in device', async () => {
    const { addSchedulesToDeviceDto, sut } = makeSut();
    jest
      .spyOn(sut['addSchedulingToDeviceRepository'], 'add')
      .mockResolvedValueOnce('');
    const result = await sut.execute(addSchedulesToDeviceDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotCreated);
  });
});
