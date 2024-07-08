import {
  EntityNotEmpty,
  EntityNotExists,
  FindPlaylistByIdRepository,
  PlaylistResponseDto,
  ValidationPlaylistId,
} from '../../../src';
import { FindPlaylistByIdRepositoryMock } from '../../repository';

const makeSut = (id: string, repository: FindPlaylistByIdRepository) => {
  const sut = ValidationPlaylistId(id, repository);

  return {
    sut,
  };
};

describe('ValidationUserId', () => {
  it('should return undefined when exist playlist id in database', async () => {
    const { sut } = makeSut('any_id', new FindPlaylistByIdRepositoryMock());

    const result = await sut;
    expect(result.value).toStrictEqual(undefined);
  });

  it('should return EntityNotEmpty when no pass correct user id', async () => {
    const { sut } = makeSut('', new FindPlaylistByIdRepositoryMock());

    const result = await sut;
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotExists when no pass correct playlist id', async () => {
    const mockEmptyItem = {} as PlaylistResponseDto;

    const mockEmptyRepository: FindPlaylistByIdRepository = {
      find: jest.fn(async () => mockEmptyItem),
    };
    const { sut } = makeSut('any_id', mockEmptyRepository);

    const result = await sut;
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });
});
