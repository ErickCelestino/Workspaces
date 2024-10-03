import {
  CompanyResponseDto,
  EntityNotExists,
  EntityNotPermissions,
  FindCompanyByIdRepository,
  FindUserByIdRepository,
  FindUserIdByCompanyIdRepository,
  ListCompaniesByUserId,
  ListCompaniesByUserIdDto,
  ListCompaniesByUserIdRepository,
  PermissionsUserResponseDto,
  UserList,
  VerifyUserPermissionsByIdRepository,
} from '../../../src';
import {
  CompanyMock,
  ListCompanyMock,
  listUserMock,
  userMock,
} from '../../entity';
import {
  FindCompanyByIdRepositoryMock,
  FindUserByIdRepositoryMock,
  FindUserIdByCompanyIdRepositoryMock,
  ListCompaniesByUserIdRepositoryMock,
  VerifyUserPermissionsByIdRepositoryMock,
} from '../../repository';

interface SutTypes {
  sut: ListCompaniesByUserId;
  listCompaniesByUserIdDto: ListCompaniesByUserIdDto;
  findUserByIdRepository: FindUserByIdRepository;
  findCompanyByIdRepository: FindCompanyByIdRepository;
  findUserIdByCompanyIdRepository: FindUserIdByCompanyIdRepository;
  verifyUserPermissionsByIdRepository: VerifyUserPermissionsByIdRepository;
  listCompaniesByUserIdRepository: ListCompaniesByUserIdRepository;
}

const makeSut = (): SutTypes => {
  const findUserByIdRepository = new FindUserByIdRepositoryMock();
  const findCompanyByIdRepository = new FindCompanyByIdRepositoryMock();
  const findUserIdByCompanyIdRepository =
    new FindUserIdByCompanyIdRepositoryMock();
  const verifyUserPermissionsByIdRepository =
    new VerifyUserPermissionsByIdRepositoryMock();
  const listCompaniesByUserIdRepository =
    new ListCompaniesByUserIdRepositoryMock();

  const listCompaniesByUserIdDto: ListCompaniesByUserIdDto = {
    companyId: CompanyMock.simple.id,
    loggedUserId: userMock.userId,
    userId: userMock.userId,
  };

  const sut = new ListCompaniesByUserId(
    findUserByIdRepository,
    findCompanyByIdRepository,
    findUserIdByCompanyIdRepository,
    verifyUserPermissionsByIdRepository,
    listCompaniesByUserIdRepository
  );

  return {
    findUserByIdRepository,
    findCompanyByIdRepository,
    findUserIdByCompanyIdRepository,
    verifyUserPermissionsByIdRepository,
    listCompaniesByUserIdRepository,
    listCompaniesByUserIdDto,
    sut,
  };
};

describe('ListCompaniesByUserId', () => {
  it('should return list companies when pass correct ListCompaniesByUserIdDto', async () => {
    const { sut, listCompaniesByUserIdDto } = makeSut();

    const result = await sut.execute(listCompaniesByUserIdDto);

    expect(result.isLeft()).toBeFalsy();
    expect(result.isRight()).toBeTruthy();
    expect(result.value).toStrictEqual(ListCompanyMock);
  });

  it('should return EntityNotExists when a exist Logged User in system', async () => {
    const { listCompaniesByUserIdDto, sut } = makeSut();
    jest
      .spyOn(sut['findUserByIdRepository'], 'find')
      .mockResolvedValueOnce({} as UserList);
    const result = await sut.execute(listCompaniesByUserIdDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });

  it('should return EntityNotExists when a exist User in system', async () => {
    const { listCompaniesByUserIdDto, sut } = makeSut();
    jest
      .spyOn(sut['findUserByIdRepository'], 'find')
      .mockResolvedValueOnce(listUserMock[0]);
    jest
      .spyOn(sut['findUserByIdRepository'], 'find')
      .mockResolvedValueOnce({} as UserList);
    const result = await sut.execute(listCompaniesByUserIdDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });

  it('should return EntityNotExists when a exist Company in system', async () => {
    const { listCompaniesByUserIdDto, sut } = makeSut();
    jest
      .spyOn(sut['findCompanyByIdRepository'], 'find')
      .mockResolvedValueOnce({} as CompanyResponseDto);
    const result = await sut.execute(listCompaniesByUserIdDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });

  it('should return EntityNotExists when a exist user in Company in system', async () => {
    const { listCompaniesByUserIdDto, sut } = makeSut();
    jest
      .spyOn(sut['findUserIdByCompanyIdRepository'], 'find')
      .mockResolvedValueOnce('');
    const result = await sut.execute(listCompaniesByUserIdDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });

  it('should return EntityNotPermissions when a exist user in Company in system', async () => {
    const { listCompaniesByUserIdDto, sut } = makeSut();
    jest
      .spyOn(sut['verifyUserPermissionsByIdRepository'], 'verify')
      .mockResolvedValueOnce({} as PermissionsUserResponseDto);
    const result = await sut.execute(listCompaniesByUserIdDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotPermissions);
  });
});
