import { Inject } from '@nestjs/common';
import { UseCase } from '../../../base/use-case';
import { DeleteProductDto } from '../../../dto';
import {
  EntityNotDeleted,
  EntityNotEmpty,
  EntityNotExists,
} from '../../../error';
import {
  DeleteProductRepository,
  FindProductByIdRepository,
  FindUserByIdRepository,
} from '../../../repository';
import { Either, left, right } from '../../../shared/either';
import { ValidationUserId } from '../../../utils';

export class DeleteProduct
  implements
    UseCase<DeleteProductDto, Either<EntityNotEmpty | EntityNotExists, string>>
{
  constructor(
    @Inject('FindUserByIdRepository')
    private findUserByIdRepository: FindUserByIdRepository,
    @Inject('FindProductByIdRepository')
    private findProductByIdRepository: FindProductByIdRepository,
    @Inject('DeleteProductRepository')
    private deleteProductRepository: DeleteProductRepository
  ) {}
  async execute(
    input: DeleteProductDto
  ): Promise<Either<EntityNotEmpty | EntityNotExists, string>> {
    const { id, loggedUserId } = input;

    const userValidation = await ValidationUserId(
      loggedUserId,
      this.findUserByIdRepository
    );
    if (userValidation.isLeft()) {
      return left(userValidation.value);
    }

    const filteredProduct = await this.findProductByIdRepository.find(id);

    if (Object.keys(filteredProduct.id ?? filteredProduct).length < 1) {
      return left(new EntityNotExists('Product'));
    }

    const deletedProduct = await this.deleteProductRepository.delete(input);

    if (Object.keys(deletedProduct).length < 1) {
      return left(new EntityNotDeleted('Product'));
    }

    return right(deletedProduct);
  }
}
