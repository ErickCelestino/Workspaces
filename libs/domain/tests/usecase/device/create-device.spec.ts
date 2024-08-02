import {
  FindDeviceByNameRepository,
  CreateDevice,
  CreateDeviceRepository,
  CreateDeviceDto,
  FindUserByIdRepository,
  EntityNotEmpty,
  UserList,
  EntityNotExists,
  EntityAlreadyExists,
  EntityNotCreated,
} from '../../../src';
import { DeviceMock, userMock } from '../../entity';
import {
  CreateDeviceRepositoryMock,
  FindDeviceByNameRepositoryMock,
  FindUserByIdRepositoryMock,
} from '../../repository';

interface SutTypes {
  sut: CreateDevice;
  createDeviceDto: CreateDeviceDto;
  findUserByIdRepository: FindUserByIdRepository;
  findDeviceByNameRepository: FindDeviceByNameRepository;
  createDeviceRepository: CreateDeviceRepository;
}

export const makeSut = (): SutTypes => {
  const findUserByIdRepository = new FindUserByIdRepositoryMock();
  const findDeviceByNameRepository = new FindDeviceByNameRepositoryMock();
  const createDeviceRepository = new CreateDeviceRepositoryMock();

  const createDeviceDto: CreateDeviceDto = {
    loggedUserId: userMock.userId,
    body: {
      name: DeviceMock.id,
    },
  };

  const sut = new CreateDevice(
    findUserByIdRepository,
    findDeviceByNameRepository,
    createDeviceRepository
  );

  return {
    sut,
    createDeviceDto,
    findUserByIdRepository,
    findDeviceByNameRepository,
    createDeviceRepository,
  };
};

describe('CreateDevice', () => {
  it('should return device ID when a pass correct CreateDeviceDto', async () => {
    const { sut, createDeviceDto } = makeSut();

    const result = await sut.execute(createDeviceDto);

    expect(result.isRight()).toBe(true);
    expect(result.isLeft()).toBe(false);
    expect(result.value).toBe(DeviceMock.id);
  });

  it('should return EntityNotEmpty when a pass incorrect Logged User ID', async () => {
    const { sut, createDeviceDto } = makeSut();
    createDeviceDto.loggedUserId = '';
    const result = await sut.execute(createDeviceDto);

    expect(result.isRight()).toBe(false);
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when a pass incorrect Name', async () => {
    const { sut, createDeviceDto } = makeSut();
    createDeviceDto.body.name = '';
    const result = await sut.execute(createDeviceDto);

    expect(result.isRight()).toBe(false);
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotExists when a pass incorrect Logged User ID', async () => {
    const { createDeviceDto, sut } = makeSut();
    jest
      .spyOn(sut['findUserByIdRepository'], 'find')
      .mockResolvedValueOnce({} as UserList);
    const result = await sut.execute(createDeviceDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });

  it('should return EntityNotExists when a exist device in system', async () => {
    const { createDeviceDto, sut } = makeSut();
    jest
      .spyOn(sut['findDeviceByNameRepository'], 'find')
      .mockResolvedValueOnce(DeviceMock);
    const result = await sut.execute(createDeviceDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityAlreadyExists);
  });

  it('should return EntityNotExists when a exist device in system', async () => {
    const { createDeviceDto, sut } = makeSut();
    jest
      .spyOn(sut['createDeviceRepository'], 'create')
      .mockResolvedValueOnce('');
    const result = await sut.execute(createDeviceDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotCreated);
  });
});
