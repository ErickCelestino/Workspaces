import { DescriptionOutlined } from '@mui/icons-material';
import {
  EntityNotEmpty,
  FindSchedulingByIdRepository,
  FindUserByIdRepository,
  ListPlaylistBySchedulingId,
  ListPlaylistBySchedulingIdDto,
  ListPlaylistBySchedulingIdRepository,
  ListPlaylistReponseDto,
} from '../../../src';
import {
  ListPlaylistReponseMock,
  ListSchedulesReponseMock,
  SchedulingMock,
  userMock,
} from '../../entity';
import {
  FindUserByIdRepositoryMock,
  FindSchedulingByIdRepositoryMock,
  ListPlaylistBySchedulingIdRepositoryMock,
} from '../../repository';

interface SutTypes {
  sut: ListPlaylistBySchedulingId;
  listPlaylistBySchedulingIdDto: ListPlaylistBySchedulingIdDto;
  findUserByIdRepository: FindUserByIdRepository;
  findSchedulingByIdRepository: FindSchedulingByIdRepository;
  listPlaylistBySchedulingIdRepository: ListPlaylistBySchedulingIdRepository;
}

const makeSut = (): SutTypes => {
  const findUserByIdRepository = new FindUserByIdRepositoryMock();
  const findSchedulingByIdRepository = new FindSchedulingByIdRepositoryMock();
  const listPlaylistBySchedulingIdRepository =
    new ListPlaylistBySchedulingIdRepositoryMock();

  const listPlaylistBySchedulingIdDto: ListPlaylistBySchedulingIdDto = {
    filter: '',
    id: SchedulingMock.id,
    loggedUserId: userMock.userId,
  };

  const sut = new ListPlaylistBySchedulingId(
    findUserByIdRepository,
    findSchedulingByIdRepository,
    listPlaylistBySchedulingIdRepository
  );

  return {
    sut,
    listPlaylistBySchedulingIdDto,
    findUserByIdRepository,
    findSchedulingByIdRepository,
    listPlaylistBySchedulingIdRepository,
  };
};

describe('ListPlaylistBySchedulingId', () => {
  it('should return ListPlaylistReponseDto when a pass correct ListPlaylistDto', async () => {
    const { sut, listPlaylistBySchedulingIdDto } = makeSut();

    const result = await sut.execute(listPlaylistBySchedulingIdDto);

    expect(result.isRight()).toBe(true);
    expect(result.isLeft()).toBe(false);
    expect(result.value).toStrictEqual(ListPlaylistReponseMock);
  });

  it('should return EntityNotEmpty when pass incorrect User ID', async () => {
    const { sut, listPlaylistBySchedulingIdDto } = makeSut();
    listPlaylistBySchedulingIdDto.loggedUserId = '';
    const result = await sut.execute(listPlaylistBySchedulingIdDto);

    expect(result.isRight()).toBe(false);
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when pass Scheduling ID', async () => {
    const { sut, listPlaylistBySchedulingIdDto } = makeSut();
    listPlaylistBySchedulingIdDto.id = '';
    const result = await sut.execute(listPlaylistBySchedulingIdDto);

    expect(result.isRight()).toBe(false);
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });
});
