import {
  FindUserByIdRepositoryMock,
  ListCompanyRepositoryMock,
  VerifyUserPermissionsByIdRepositoryMock,
} from '../../../repository';
import {
  EntityNotExists,
  EntityNotPermissions,
  FindUserByIdRepository,
  ListCompany,
  ListCompanyDto,
  ListCompanyRepository,
  PermissionsUserResponseDto,
  UserList,
  VerifyUserPermissionsByIdRepository,
} from '../../../../src';
import { ListCompanyMock, userMock } from '../../../entity';

interface SutTypes {
  sut: ListCompany;
  listCompanyDto: ListCompanyDto;
  findUserByIdRepository: FindUserByIdRepository;
  verifyUserPermissionsByIdRepository: VerifyUserPermissionsByIdRepository;
  listCompanyRepository: ListCompanyRepository;
}

const makeSut = (): SutTypes => {
  const findUserByIdRepository = new FindUserByIdRepositoryMock();
  const listCompanyRepository = new ListCompanyRepositoryMock();
  const verifyUserPermissionsByIdRepository =
    new VerifyUserPermissionsByIdRepositoryMock();

  const listCompanyDto: ListCompanyDto = {
    filter: '',
    loggedUserId: userMock.userId,
  };

  const sut = new ListCompany(
    findUserByIdRepository,
    verifyUserPermissionsByIdRepository,
    listCompanyRepository
  );

  return {
    sut,
    listCompanyDto,
    findUserByIdRepository,
    verifyUserPermissionsByIdRepository,
    listCompanyRepository,
  };
};

describe('ListCompany', () => {
  it('should return list company when pass correct ListCompanyDto', async () => {
    const { sut, listCompanyDto } = makeSut();
    const result = await sut.execute(listCompanyDto);

    expect(result.isLeft()).toBe(false);
    expect(result.isRight()).toBe(true);
    expect(result.value).toStrictEqual(ListCompanyMock);
  });

  it('should return EntityNotPermissions when a exist user in Company in system', async () => {
    const { listCompanyDto, sut } = makeSut();
    jest
      .spyOn(sut['verifyUserPermissionsByIdRepository'], 'verify')
      .mockResolvedValueOnce({} as PermissionsUserResponseDto);
    const result = await sut.execute(listCompanyDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotPermissions);
  });

  it('should return EntityNotExists when a exist User in system', async () => {
    const { listCompanyDto, sut } = makeSut();
    jest
      .spyOn(sut['findUserByIdRepository'], 'find')
      .mockResolvedValueOnce({} as UserList);
    const result = await sut.execute(listCompanyDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });
});
