import {
  EntityNotEmpty,
  EntityNotPermissions,
  PermissionsUserResponseDto,
  ValidationUserPermisssions,
  VerifyUserPermissionsByIdRepository,
} from '../../../src';
import { VerifyUserPermissionsByIdRepositoryMock } from '../../repository';

const makeSut = (
  id: string,
  repository: VerifyUserPermissionsByIdRepository
) => {
  const sut = ValidationUserPermisssions(
    id,
    ['ADMIN', 'DEFAULT_ADMIN'],
    repository
  );

  return {
    sut,
  };
};

describe('ValidationUserPermisssions', () => {
  it('should return undefined when exist user id in database', async () => {
    const { sut } = makeSut(
      'any_id',
      new VerifyUserPermissionsByIdRepositoryMock()
    );

    const result = await sut;

    expect(result?.isLeft()).toBe(false);
    expect(result?.isRight()).toBe(true);
    expect(result?.value).toStrictEqual(undefined);
  });

  it('should return EntityNotEmpty when no pass correct user id', async () => {
    const { sut } = makeSut('', new VerifyUserPermissionsByIdRepositoryMock());

    const result = await sut;

    expect(result?.isLeft()).toBe(true);
    expect(result?.isRight()).toBe(false);
    expect(result?.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return NotPermissionError when no pass correct user id', async () => {
    const mockEmptyItem = {} as PermissionsUserResponseDto;

    const mockEmptyRepository: VerifyUserPermissionsByIdRepository = {
      verify: jest.fn(async () => mockEmptyItem),
    };
    const { sut } = makeSut('any_id', mockEmptyRepository);

    const result = await sut;

    expect(result?.isLeft()).toBe(true);
    expect(result?.isRight()).toBe(false);
    expect(result?.value).toBeInstanceOf(EntityNotPermissions);
  });
});
