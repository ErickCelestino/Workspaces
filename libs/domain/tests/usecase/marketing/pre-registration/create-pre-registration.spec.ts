import {
  CreatePreRegistration,
  CreatePreRegistrationDto,
  CreatePreRegistrationRepository,
  EntityNotCreated,
  EntityNotEmpty,
} from '../../../../src';
import { PreRegistrationMock } from '../../../entity';
import { CreatePreRegistrationRepositoryMock } from '../../../repository/marketing/pre-registration/create-pre-registration.mock';

interface SutTypes {
  sut: CreatePreRegistration;
  createPreRegistrationDto: CreatePreRegistrationDto;
  createPreRegistrationRepository: CreatePreRegistrationRepository;
}

const makeSut = (): SutTypes => {
  const createPreRegistrationRepository =
    new CreatePreRegistrationRepositoryMock();

  const createPreRegistrationDto: CreatePreRegistrationDto = {
    sendingId: PreRegistrationMock.id,
  };

  const sut = new CreatePreRegistration(createPreRegistrationRepository);

  return {
    createPreRegistrationRepository,
    createPreRegistrationDto,
    sut,
  };
};

describe('CreatePreRegistration', () => {
  it('should return Created Pre Registration ID when pass correct createPreRegistrationDto', async () => {
    const { createPreRegistrationDto, sut } = makeSut();

    const result = await sut.execute(createPreRegistrationDto);

    expect(result.isRight()).toBeTruthy();
    expect(result.isLeft()).toBeFalsy();
    expect(result.value).toStrictEqual(PreRegistrationMock.id);
  });

  it('should return EntityNotEmpty when pass empty sendingId', async () => {
    const { createPreRegistrationDto, sut } = makeSut();
    createPreRegistrationDto.sendingId = '';
    const result = await sut.execute(createPreRegistrationDto);

    expect(result.isRight()).toBeFalsy();
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotCreated when a not created pre-registration in database', async () => {
    const { sut, createPreRegistrationDto } = makeSut();
    jest
      .spyOn(sut['createPreRegistrationRepository'], 'create')
      .mockResolvedValueOnce('');

    const result = await sut.execute(createPreRegistrationDto);

    expect(result.isRight()).toBe(false);
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotCreated);
  });
});
