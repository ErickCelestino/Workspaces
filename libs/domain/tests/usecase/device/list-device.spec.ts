import {
  ListDevice,
  ListDeviceRepository,
  FindUserByIdRepository,
  ListDeviceDto,
  EntityNotEmpty,
  EntityNotExists,
  UserList,
} from '../../../src';
import { ListDeviceResponseMock, userMock } from '../../entity';
import {
  FindUserByIdRepositoryMock,
  ListDeviceRepositoryMock,
} from '../../repository';

interface SutTypes {
  sut: ListDevice;
  listDeviceDto: ListDeviceDto;
  finUserByIdRepository: FindUserByIdRepository;
  listDeviceRepository: ListDeviceRepository;
}

export const makeSut = (): SutTypes => {
  const finUserByIdRepository = new FindUserByIdRepositoryMock();
  const listDeviceRepository = new ListDeviceRepositoryMock();

  const listDeviceDto: ListDeviceDto = {
    loggedUserId: userMock.userId,
    filter: '',
  };

  const sut = new ListDevice(finUserByIdRepository, listDeviceRepository);

  return {
    sut,
    listDeviceDto,
    finUserByIdRepository,
    listDeviceRepository,
  };
};

describe('ListDevice', () => {
  it('should  return ListDeviceResponseDto when pass correct ListDeviceDto', async () => {
    const { listDeviceDto, sut } = makeSut();

    const result = await sut.execute(listDeviceDto);

    expect(result.isRight()).toBe(true);
    expect(result.isLeft()).toBe(false);
    expect(result.value).toStrictEqual(ListDeviceResponseMock);
  });

  it('should  return EntityNotEmpty when pass incorrect Logged User Id', async () => {
    const { listDeviceDto, sut } = makeSut();
    listDeviceDto.loggedUserId = '';
    const result = await sut.execute(listDeviceDto);

    expect(result.isRight()).toBe(false);
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotExists when a pass incorrect Logged User ID', async () => {
    const { listDeviceDto, sut } = makeSut();
    jest
      .spyOn(sut['findUserByIdRepository'], 'find')
      .mockResolvedValueOnce({} as UserList);
    const result = await sut.execute(listDeviceDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });
});
