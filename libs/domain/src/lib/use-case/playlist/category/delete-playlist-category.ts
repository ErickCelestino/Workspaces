import { Inject } from '@nestjs/common';
import { UseCase } from '../../../base/use-case';
import { DeletePlaylistCategoryDto } from '../../../dto';
import { EntityNotEmpty, EntityNotExists } from '../../../error';
import {
  DeletePlaylistCategoryRepository,
  FindPlaylistCategoryByIdRepository,
  FindUserByIdRepository,
} from '../../../repository';
import { Either, left, right } from '../../../shared/either';
import { ValidationPlaylistCategoryId, ValidationUserId } from '../../../utils';

export class DeletePlaylistCategory
  implements UseCase<DeletePlaylistCategoryDto, Either<EntityNotEmpty, void>>
{
  constructor(
    @Inject('FindUserByIdRepository')
    private findUserByIdRepository: FindUserByIdRepository,
    @Inject('findPlaylistCategoryByIdRepository')
    private findPlaylistCategoryByIdRepository: FindPlaylistCategoryByIdRepository,
    @Inject('DeletePlaylistCategoryRepository')
    private deletePlaylistRepository: DeletePlaylistCategoryRepository
  ) {}
  async execute(
    input: DeletePlaylistCategoryDto
  ): Promise<Either<EntityNotEmpty, void>> {
    const { id, loggedUserId } = input;

    if (Object.keys(id).length < 1) {
      return left(new EntityNotEmpty('ID'));
    }

    if (Object.keys(loggedUserId).length < 1) {
      return left(new EntityNotEmpty('Logged User ID'));
    }

    await ValidationUserId(loggedUserId, this.findUserByIdRepository);

    await ValidationPlaylistCategoryId(
      id,
      this.findPlaylistCategoryByIdRepository
    );

    await this.deletePlaylistRepository.delete(id);

    return right(undefined);
  }
}
