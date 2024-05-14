import {
  BtrinSanitizeRepository,
  InsufficientCharacters,
  ListUser,
  ListUserDto,
  ListUserRepository,
} from '../../../src';
import {
  BtrinSanitizeRepositoryMock,
  ListUserRepositoryMock,
} from '../../repository';

interface SutTypes {
  sut: ListUser;
  listUserDto: ListUserDto;
  listUserRepository: ListUserRepository;
  btrinSanitizeRepository: BtrinSanitizeRepository;
}

const makeSut = (): SutTypes => {
  const listUserRepository = new ListUserRepositoryMock();
  const btrinSanitizeRepository = new BtrinSanitizeRepositoryMock();

  const listUserDto: ListUserDto = {
    input: 'any_input',
  };

  const sut = new ListUser(listUserRepository, btrinSanitizeRepository);

  return {
    sut,
    listUserDto,
    listUserRepository,
    btrinSanitizeRepository,
  };
};

describe('ListUser', () => {
  it('should return a list of users if the input is correct', async () => {
    const { listUserDto, sut } = makeSut();

    const result = await sut.execute(listUserDto.input);

    expect(result.isRight());
    expect(result.value);
  });

  it('should left SyntaxError if sent an input with any syntax error not sanitized', async () => {
    const { sut, listUserDto, btrinSanitizeRepository } = makeSut();

    btrinSanitizeRepository.btrin = () => undefined;

    const result = await sut.execute(listUserDto.input);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(SyntaxError);
  });
});
