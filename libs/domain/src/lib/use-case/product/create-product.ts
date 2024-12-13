import { Inject } from '@nestjs/common';
import { UseCase } from '../../base/use-case';
import { CreateProductDto } from '../../dto';
import {
  EntityAlreadyExists,
  EntityIsNotEmpty,
  EntityNotCreated,
  EntityNotEmpty,
  EntityNotExists,
} from '../../error';
import {
  CreateProductRepository,
  FindProductByNameRespository,
  FindUserByIdRepository,
} from '../../repository';
import { Either, left, right } from '../../shared/either';
import { ValidationUserId } from '../../utils';

export class CreateProduct
  implements
    UseCase<
      CreateProductDto,
      Either<
        | EntityIsNotEmpty
        | EntityNotExists
        | EntityAlreadyExists
        | EntityNotCreated,
        string
      >
    >
{
  constructor(
    @Inject('FindUserByIdRepository')
    private findUserByIdRepository: FindUserByIdRepository,
    @Inject('FindProductByNameRespository')
    private findProductByNameRespository: FindProductByNameRespository,
    @Inject('CreateProductRepository')
    private createProductRespository: CreateProductRepository
  ) {}
  async execute(
    input: CreateProductDto
  ): Promise<
    Either<
      | EntityIsNotEmpty
      | EntityNotExists
      | EntityAlreadyExists
      | EntityNotCreated,
      string
    >
  > {
    const {
      body: { name, description, maximumDiscount, standardPrice },
      loggedUserId,
    } = input;

    if (Object.keys(name).length < 1) {
      return left(new EntityNotEmpty('Name'));
    }

    if (Object.keys(description).length < 1) {
      return left(new EntityNotEmpty('Description'));
    }

    if (Object.keys(maximumDiscount).length < 1) {
      return left(new EntityNotEmpty('Maximum Discount'));
    }

    if (Object.keys(standardPrice).length < 1) {
      return left(new EntityNotEmpty('Standard Price'));
    }

    const userValidation = await ValidationUserId(
      loggedUserId,
      this.findUserByIdRepository
    );

    if (userValidation.isLeft()) {
      return left(userValidation.value);
    }

    const filteredProduct = await this.findProductByNameRespository.find({
      loggedUserId,
      name,
    });

    if (Object.keys(filteredProduct?.id ?? filteredProduct).length > 1) {
      return left(new EntityAlreadyExists('Product'));
    }

    const createadProduct = await this.createProductRespository.create(input);

    if (Object.keys(createadProduct).length < 1) {
      return left(new EntityNotCreated('Product'));
    }

    return right(createadProduct);
  }
}
