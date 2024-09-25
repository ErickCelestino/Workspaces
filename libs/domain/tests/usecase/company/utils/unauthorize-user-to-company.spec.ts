import {
  FindCompanyByIdRepository,
  FindUserByIdRepository,
  FindUserIdByCompanyIdRepository,
  UnauthorizeUserToCompany,
  UnauthorizeUserToCompanyRepository,
  VerifyUserPermissionsByIdRepository,
  EntityNotEmpty,
  EntityNotExists,
  UserList,
  CompanyResponseDto,
  PermissionsUserResponseDto,
  EntityNotPermissions,
  UnauthorizeUserToCompanyDto,
  EntityNotComplete,
} from '../../../../src';
import { CompanyMock, listUserMock, userMock } from '../../../entity';
import {
  FindCompanyByIdRepositoryMock,
  FindUserByIdRepositoryMock,
  FindUserIdByCompanyIdRepositoryEmptyMock,
  UnauthorizeUserToCompanyRepositoryMock,
  VerifyUserPermissionsByIdRepositoryMock,
} from '../../../repository';

interface SutTypes {
  sut: UnauthorizeUserToCompany;
  unauthorizeUserToCompanyDto: UnauthorizeUserToCompanyDto;
  findUserByIdRepository: FindUserByIdRepository;
  findCompanyByIdRepository: FindCompanyByIdRepository;
  findUserIdByCompanyIdRepository: FindUserIdByCompanyIdRepository;
  verifyUserPermissionsByIdRepository: VerifyUserPermissionsByIdRepository;
  unauthorizeUserToCompanyRepository: UnauthorizeUserToCompanyRepository;
}

const makeSut = (): SutTypes => {
  const findUserByIdRepository = new FindUserByIdRepositoryMock();
  const findCompanyByIdRepository = new FindCompanyByIdRepositoryMock();
  const findUserIdByCompanyIdRepository: FindUserIdByCompanyIdRepository = {
    find: jest.fn(async () => `${userMock.userId}-${CompanyMock.simple.id}`),
  };
  const verifyUserPermissionsByIdRepository =
    new VerifyUserPermissionsByIdRepositoryMock();
  const unauthorizeUserToCompanyRepository =
    new UnauthorizeUserToCompanyRepositoryMock();

  const unauthorizeUserToCompanyDto: UnauthorizeUserToCompanyDto = {
    companyId: CompanyMock.simple.id,
    loggedUserId: userMock.userId,
    userId: userMock.userId,
  };

  const sut = new UnauthorizeUserToCompany(
    findUserByIdRepository,
    findCompanyByIdRepository,
    findUserIdByCompanyIdRepository,
    verifyUserPermissionsByIdRepository,
    unauthorizeUserToCompanyRepository
  );

  return {
    findUserByIdRepository,
    findCompanyByIdRepository,
    findUserIdByCompanyIdRepository,
    verifyUserPermissionsByIdRepository,
    unauthorizeUserToCompanyRepository,
    unauthorizeUserToCompanyDto,
    sut,
  };
};

describe('UnauthorizeUserToCompany', () => {
  it('should return company ID when pass correct unauthorizeUserToCompanyDto', async () => {
    const { sut, unauthorizeUserToCompanyDto } = makeSut();

    const result = await sut.execute(unauthorizeUserToCompanyDto);

    expect(result.isLeft()).toBeFalsy();
    expect(result.isRight()).toBeTruthy();
    expect(result.value).toStrictEqual(CompanyMock.simple.id);
  });

  it('should return EntityNotEmpty when pass incorrect Company id', async () => {
    const { sut, unauthorizeUserToCompanyDto } = makeSut();
    unauthorizeUserToCompanyDto.companyId = '';
    const result = await sut.execute(unauthorizeUserToCompanyDto);

    expect(result.isRight()).toBe(false);
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when pass incorrect Logged User id', async () => {
    const { sut, unauthorizeUserToCompanyDto } = makeSut();
    unauthorizeUserToCompanyDto.loggedUserId = '';
    const result = await sut.execute(unauthorizeUserToCompanyDto);

    expect(result.isRight()).toBe(false);
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when pass incorrect User id', async () => {
    const { sut, unauthorizeUserToCompanyDto } = makeSut();
    unauthorizeUserToCompanyDto.userId = '';
    const result = await sut.execute(unauthorizeUserToCompanyDto);

    expect(result.isRight()).toBe(false);
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotExists when a exist Logged User in system', async () => {
    const { unauthorizeUserToCompanyDto, sut } = makeSut();
    jest
      .spyOn(sut['findUserByIdRepository'], 'find')
      .mockResolvedValueOnce({} as UserList);
    const result = await sut.execute(unauthorizeUserToCompanyDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });

  it('should return EntityNotExists when a exist User in system', async () => {
    const { unauthorizeUserToCompanyDto, sut } = makeSut();
    jest
      .spyOn(sut['findUserByIdRepository'], 'find')
      .mockResolvedValueOnce(listUserMock[0]);
    jest
      .spyOn(sut['findUserByIdRepository'], 'find')
      .mockResolvedValueOnce({} as UserList);
    const result = await sut.execute(unauthorizeUserToCompanyDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });

  it('should return EntityNotExists when a exist Company in system', async () => {
    const { unauthorizeUserToCompanyDto, sut } = makeSut();
    jest
      .spyOn(sut['findCompanyByIdRepository'], 'find')
      .mockResolvedValueOnce({} as CompanyResponseDto);
    const result = await sut.execute(unauthorizeUserToCompanyDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });

  it('should return EntityNotExists when a exist user in Company in system', async () => {
    const { unauthorizeUserToCompanyDto, sut } = makeSut();
    jest
      .spyOn(sut['findUserIdByCompanyIdRepository'], 'find')
      .mockResolvedValueOnce('');
    const result = await sut.execute(unauthorizeUserToCompanyDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });

  it('should return EntityNotPermissions when a exist user in Company in system', async () => {
    const { unauthorizeUserToCompanyDto, sut } = makeSut();
    jest
      .spyOn(sut['verifyUserPermissionsByIdRepository'], 'verify')
      .mockResolvedValueOnce({} as PermissionsUserResponseDto);
    const result = await sut.execute(unauthorizeUserToCompanyDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotPermissions);
  });

  it('should return EntityNotComplete when a not complete action in system', async () => {
    const { unauthorizeUserToCompanyDto, sut } = makeSut();
    jest
      .spyOn(sut['unauthorizeUserToCompanyRepository'], 'auth')
      .mockResolvedValueOnce('');
    const result = await sut.execute(unauthorizeUserToCompanyDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotComplete);
  });
});
