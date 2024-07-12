import {
  CreateDirectoryDto,
  CreateDirectoryRepository,
  EntityNotEmpty,
  FindDirectoryByNameRepository,
  FindUserByIdRepository,
  UserList,
} from '../../../src';
import { CreateDirectory } from '../../../src/lib/use-case';
import { DirectoryMock, userMock } from '../../entity';
import { FindUserByIdRepositoryMock } from '../../repository';
import { CreateDirectoryRepositoryMock } from '../../repository/directory/create-directory.mock';
import { FindDirectoryByNameRepositoryMock } from '../../repository/directory/find-directory-by-name.mock';

interface SutTypes {
  sut: CreateDirectory;
  CreateDirectoryDto: CreateDirectoryDto;
  FindUserByIdRepository: FindUserByIdRepository;
  FindDirectoryByNameRepository: FindDirectoryByNameRepository;
  CreateDirectoryRepository: CreateDirectoryRepository;
}

const makeSut = (): SutTypes => {
  const CreateDirectoryRepository = new CreateDirectoryRepositoryMock();
  const FindUserByIdRepository = new FindUserByIdRepositoryMock();
  const FindDirectoryByNameRepository = new FindDirectoryByNameRepositoryMock();

  const CreateDirectoryDto: CreateDirectoryDto = {
    name: DirectoryMock.name,
    loggedUserId: userMock.userId,
  };

  const sut = new CreateDirectory(
    FindUserByIdRepository,
    FindDirectoryByNameRepository,
    CreateDirectoryRepository
  );

  return {
    CreateDirectoryRepository,
    FindDirectoryByNameRepository,
    FindUserByIdRepository,
    CreateDirectoryDto,
    sut,
  };
};

describe('CreateDirectory', () => {
  it('garantir que vai retornar uma string quando todos os dados estiverem corretos', async () => {
    const { sut, CreateDirectoryDto } = makeSut();
    const result = await sut.execute(CreateDirectoryDto);
    expect(result.isRight()).toBe(true);
  });

  it('garantir que vai retornar erro EntityNotEmpty se o campo name estiver vazio', async () => {
    const { sut, CreateDirectoryDto } = makeSut();
    CreateDirectoryDto.name = '';
    const result = await sut.execute(CreateDirectoryDto);
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('garantir que vai retornar erro EntityNotEmpty se o campo loggedUserId estiver vazio', async () => {
    const { sut, CreateDirectoryDto } = makeSut();
    CreateDirectoryDto.loggedUserId = '';
    const result = await sut.execute(CreateDirectoryDto);
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('garantir que vai retornar erro EntityNotExists se o usuário não existir', async () => {
    const { sut, CreateDirectoryDto, FindUserByIdRepository } = makeSut();
    jest
      .spyOn(FindUserByIdRepository, 'find')
      .mockResolvedValueOnce({} as UserList);
    const result = await sut.execute(CreateDirectoryDto);
    expect(result.isLeft()).toBe(true);
  });

  it('garantir que vai retornar erro EntityAlreadyExists se o diretório já existir', async () => {
    const { sut, CreateDirectoryDto, FindDirectoryByNameRepository } =
      makeSut();
    jest
      .spyOn(FindDirectoryByNameRepository, 'find')
      .mockResolvedValueOnce(DirectoryMock.id);
    const result = await sut.execute(CreateDirectoryDto);
    expect(result.isLeft()).toBe(true);
  });

  it('garantir que vai retornar erro EntityNotCreated se o diretório não for criado', async () => {
    const { sut, CreateDirectoryDto, CreateDirectoryRepository } = makeSut();
    jest.spyOn(CreateDirectoryRepository, 'create').mockResolvedValueOnce('');
    const result = await sut.execute(CreateDirectoryDto);
    expect(result.isLeft()).toBe(true);
  });
});
