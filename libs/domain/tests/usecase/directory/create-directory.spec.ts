import {
  CreateDirectoryDto,
  CreateDirectoryRepository,
  FindDirectoryByNameRepository,
  FindUserByIdRepository,
} from '../../../src';
import { CreateDirectory } from '../../../src/lib/use-case';
import { DirectoryMock, userMock } from '../../entity';
import {
  CreateDirectoryRepositoryMock,
  FindUserByIdRepositoryMock,
} from '../../repository';
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
});
