import {
  CreateProduct,
  CreateProductDto,
  CreateProductRepository,
  EntityAlreadyExists,
  EntityNotaNumber,
  EntityNotCreated,
  EntityNotEmpty,
  EntityNotExists,
  FindProductByNameRespository,
  FindUserByIdRepository,
  UserList,
} from '../../../src';
import { ProductMock, userMock } from '../../entity';
import { FindUserByIdRepositoryMock } from '../../repository';
import { CreateProductRepositoryMock } from '../../repository/product/create-product.mock';
import { FindProductByNameRespositoryMock } from '../../repository/product/find-product-by-name.mock';

interface SutTypes {
  sut: CreateProduct;
  createProductDto: CreateProductDto;
  findUserByIdRepository: FindUserByIdRepository;
  findProductByNameRepository: FindProductByNameRespository;
  createProductRepository: CreateProductRepository;
}

const makeSut = (): SutTypes => {
  const findUserByIdRepository = new FindUserByIdRepositoryMock();
  const findProductByNameRepository = new FindProductByNameRespositoryMock();
  const createProductRepository = new CreateProductRepositoryMock();

  const createProductDto: CreateProductDto = {
    loggedUserId: userMock.userId,
    body: {
      name: ProductMock.name,
      description: ProductMock.description,
      maximumDiscount: ProductMock.maximumDiscount,
      standardPrice: ProductMock.standardPrice,
    },
  };

  const sut = new CreateProduct(
    findUserByIdRepository,
    findProductByNameRepository,
    createProductRepository
  );

  return {
    sut,
    createProductDto,
    findUserByIdRepository,
    findProductByNameRepository,
    createProductRepository,
  };
};

describe('CreateProduct', () => {
  it('should return Product ID when pass correct createProductDto', async () => {
    const { createProductDto, sut } = makeSut();

    const result = await sut.execute(createProductDto);

    expect(result.isLeft()).toBeFalsy();
    expect(result.isRight()).toBeTruthy();
    expect(result.value).toStrictEqual(ProductMock.id);
  });

  it('should return EntityNotEmpty when a pass empty loggedUserId in validateTokenDto', async () => {
    const { sut, createProductDto } = makeSut();
    createProductDto.loggedUserId = '';
    const result = await sut.execute(createProductDto);

    expect(result.isRight()).toBeFalsy();
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when a pass empty description in validateTokenDto', async () => {
    const { sut, createProductDto } = makeSut();
    createProductDto.body.description = '';
    const result = await sut.execute(createProductDto);

    expect(result.isRight()).toBeFalsy();
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when a pass empty name in validateTokenDto', async () => {
    const { sut, createProductDto } = makeSut();
    createProductDto.body.name = '';
    const result = await sut.execute(createProductDto);

    expect(result.isRight()).toBeFalsy();
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when a pass empty maximumDiscount in validateTokenDto', async () => {
    const { sut, createProductDto } = makeSut();
    createProductDto.body.maximumDiscount = '';
    const result = await sut.execute(createProductDto);

    expect(result.isRight()).toBeFalsy();
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotEmpty when a pass empty standardPrice in validateTokenDto', async () => {
    const { sut, createProductDto } = makeSut();
    createProductDto.body.standardPrice = '';
    const result = await sut.execute(createProductDto);

    expect(result.isRight()).toBeFalsy();
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(EntityNotEmpty);
  });

  it('should return EntityNotaNumber when a pass not a number standardPrice in validateTokenDto', async () => {
    const { sut, createProductDto } = makeSut();
    createProductDto.body.standardPrice = 'any_string';
    const result = await sut.execute(createProductDto);

    expect(result.isRight()).toBeFalsy();
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(EntityNotaNumber);
  });

  it('should return EntityNotaNumber when a pass not a number maximumDiscount in validateTokenDto', async () => {
    const { sut, createProductDto } = makeSut();
    createProductDto.body.maximumDiscount = 'any_string';
    const result = await sut.execute(createProductDto);

    expect(result.isRight()).toBeFalsy();
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(EntityNotaNumber);
  });

  it('should return EntityNotExists when a return empty user in findUserByIdRepository', async () => {
    const { sut, createProductDto } = makeSut();

    jest
      .spyOn(sut['findUserByIdRepository'], 'find')
      .mockResolvedValueOnce({} as UserList);

    const result = await sut.execute(createProductDto);

    expect(result.isRight()).toBeFalsy();
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(EntityNotExists);
  });

  it('should return EntityAlreadyExists when a return empty product in findUserByIdRepository', async () => {
    const { sut, createProductDto } = makeSut();

    jest
      .spyOn(sut['findProductByNameRespository'], 'find')
      .mockResolvedValueOnce(ProductMock);

    const result = await sut.execute(createProductDto);

    expect(result.isRight()).toBeFalsy();
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(EntityAlreadyExists);
  });

  it('should return EntityNotCreated when a return empty product in findUserByIdRepository', async () => {
    const { sut, createProductDto } = makeSut();

    jest
      .spyOn(sut['createProductRespository'], 'create')
      .mockResolvedValueOnce('');

    const result = await sut.execute(createProductDto);

    expect(result.isRight()).toBeFalsy();
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(EntityNotCreated);
  });
});
