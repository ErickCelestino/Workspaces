import {
  Directory,
  EditDirectory,
  EditDirectoryDto,
  EditDirectoryRepository,
  EntityNotEdit,
  EntityNotEmpty,
  EntityNotExists,
  FindDirectoryByIdRepository,
  FindUserByIdRepository,
  UserList,
} from '../../../src';
import { DirectoryMock, userMock } from '../../entity';
import {
  EditDirectoryRepositoryMock,
  FindDirectoryByIdRespositoryMock,
  FindUserByIdRepositoryMock,
} from '../../repository';

interface SutTypes {
  sut: EditDirectory;
  editDirectoryDto: EditDirectoryDto;
  findUserByIdRepository: FindUserByIdRepository;
  findDirectoryByIdRepository: FindDirectoryByIdRepository;
  editDirectoryRepository: EditDirectoryRepository;
}

const makeSut = (): SutTypes => {
  const findUserByIdRepository = new FindUserByIdRepositoryMock();
  const findDirectoryByIdRepository = new FindDirectoryByIdRespositoryMock();
  const editDirectoryRepository = new EditDirectoryRepositoryMock();

  const editDirectoryDto: EditDirectoryDto = {
    id: DirectoryMock.id,
    loggedUserId: userMock.userId,
    newName: DirectoryMock.name,
  };

  const sut = new EditDirectory(
    findUserByIdRepository,
    findDirectoryByIdRepository,
    editDirectoryRepository
  );

  return {
    sut,
    editDirectoryDto,
    findUserByIdRepository,
    findDirectoryByIdRepository,
    editDirectoryRepository,
  };
};

describe('EditDirectory', () => {
  it('should return Directory ID when pass correct EditDirectoryDto', async () => {
    const { editDirectoryDto, sut } = makeSut();

    const result = await sut.execute(editDirectoryDto);

    expect(result.isRight()).toBe(true);
    expect(result.isLeft()).toBe(false);
    expect(result.value).toBe(DirectoryMock.id);
  });

  it('should return EntityNotEmpty when pass incorrect Logged User id', async () => {
    const { editDirectoryDto, sut } = makeSut();
    editDirectoryDto.loggedUserId = '';
    const result = await sut.execute(editDirectoryDto);

    expect(result.isRight()).toBe(false);
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when pass incorrect Directory newName', async () => {
    const { editDirectoryDto, sut } = makeSut();
    editDirectoryDto.newName = '';
    const result = await sut.execute(editDirectoryDto);

    expect(result.isRight()).toBe(false);
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when pass incorrect Directory ID', async () => {
    const { editDirectoryDto, sut } = makeSut();
    editDirectoryDto.id = '';
    const result = await sut.execute(editDirectoryDto);

    expect(result.isRight()).toBe(false);
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotNotExists when a exist not User in system', async () => {
    const { editDirectoryDto, sut } = makeSut();
    jest
      .spyOn(sut['findUserByIdRepository'], 'find')
      .mockResolvedValueOnce({} as UserList);
    const result = await sut.execute(editDirectoryDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });

  it('should return EntityNotNotExists when a exist not Directory in system', async () => {
    const { editDirectoryDto, sut } = makeSut();
    jest
      .spyOn(sut['findDirectoryByIdRepository'], 'find')
      .mockResolvedValueOnce({} as Directory);
    const result = await sut.execute(editDirectoryDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });

  it('should return EntityNotEdit when a not edit Directory in system', async () => {
    const { editDirectoryDto, sut } = makeSut();
    jest
      .spyOn(sut['editDirectoryRepository'], 'edit')
      .mockResolvedValueOnce('');
    const result = await sut.execute(editDirectoryDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(EntityNotEdit);
  });
});
