import {
  FindCompanyByIdRepositoryMock,
  FindUserByIdRepositoryMock,
  ListSchedulesRepositoryMock,
} from '../../repository';
import {
  ListSchedulesRepository,
  FindUserByIdRepository,
  ListSchedulesDto,
  EntityNotEmpty,
  ListSchedules,
  UserList,
  EntityNotExists,
  FindCompanyByIdRepository,
  CompanyResponseDto,
} from '../../../src';
import { CompanyMock, ListSchedulesReponseMock, userMock } from '../../entity';

interface SutTypes {
  sut: ListSchedules;
  listSchedulingDto: ListSchedulesDto;
  findUserByIdRepository: FindUserByIdRepository;
  findCompanyByIdRepository: FindCompanyByIdRepository;
  listSchedulingRepository: ListSchedulesRepository;
}

const makeSut = (): SutTypes => {
  const findUserByIdRepository = new FindUserByIdRepositoryMock();
  const listSchedulingRepository = new ListSchedulesRepositoryMock();
  const findCompanyByIdRepository = new FindCompanyByIdRepositoryMock();

  const listSchedulingDto: ListSchedulesDto = {
    loggedUserId: userMock.userId,
    companyId: CompanyMock.simple.id,
    filter: '',
  };

  const sut = new ListSchedules(
    findUserByIdRepository,
    findCompanyByIdRepository,
    listSchedulingRepository
  );

  return {
    findUserByIdRepository,
    findCompanyByIdRepository,
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

  it('should return EntityNotEmpty  when a pass incorrect Company ID', async () => {
    const { sut, listSchedulingDto } = makeSut();
    listSchedulingDto.companyId = '';
    const result = await sut.execute(listSchedulingDto);

    expect(result.isRight()).toBe(false);
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotExists when a not exist User in system', async () => {
    const { listSchedulingDto, sut } = makeSut();
    jest
      .spyOn(sut['findUserByIdRepository'], 'find')
      .mockResolvedValueOnce({} as UserList);
    const result = await sut.execute(listSchedulingDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });

  it('should return EntityNotExists when a not exist User in system', async () => {
    const { listSchedulingDto, sut } = makeSut();
    jest
      .spyOn(sut['findCompanyByIdRepository'], 'find')
      .mockResolvedValueOnce({} as CompanyResponseDto);
    const result = await sut.execute(listSchedulingDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });
});
