import {
  BtrinSanitizeRepository,
  ListUser,
  ListUserDto,
  ListUserRepository,
  SyntaxError,
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

    const result = await sut.execute(listUserDto);

    expect(result.isRight()).toBe(true);
    expect(result.isLeft()).toBe(false);
    expect(result.value);
  });

  it('should left SyntaxError if sent an input with any syntax error not sanitized', async () => {
    const { sut, listUserDto } = makeSut();

    jest
      .spyOn(sut['btrinSanitizeRepository'], 'btrin')
      .mockResolvedValueOnce(undefined);

    const result = await sut.execute(listUserDto);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(SyntaxError);
  });
});
