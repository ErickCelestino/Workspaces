import { Inject } from '@nestjs/common';
import { UseCase } from '../../../base/use-case';
import { EditPlaylistCategoryDto } from '../../../dto/request/playlist/category/edit-playlist-category.dto';
import { EntityNotEmpty, EntityNotExists } from '../../../error';
import { Either, left, right } from '../../../shared/either';
import {
  EditPlaylistCategoryRepository,
  FindPlaylistCategoryByIdRepository,
  FindUserByIdRepository,
} from '../../../repository';
import { ValidationUserId } from '../../../utils';

export class EditPlaylistCategory
  implements
    UseCase<
      EditPlaylistCategoryDto,
      Either<EntityNotEmpty | EntityNotExists, void>
    >
{
  constructor(
    @Inject('FindUserByIdRepository')
    private findUserByIdRepository: FindUserByIdRepository,
    @Inject('FindPlaylistCategoryByIdRepository')
    private findPlaylistCategoryByIdRepository: FindPlaylistCategoryByIdRepository,
    @Inject('EditPlaylistCategoryRepository')
    private editPlaylistCategoryRepository: EditPlaylistCategoryRepository
  ) {}
  async execute(
    input: EditPlaylistCategoryDto
  ): Promise<Either<EntityNotEmpty | EntityNotExists, void>> {
    const { id, loggedUserId, body } = input;

    if (Object.keys(id).length < 1) {
      return left(new EntityNotEmpty('ID'));
    }

    if (Object.keys(loggedUserId).length < 1) {
      return left(new EntityNotEmpty('Logged User ID'));
    }

    if (Object.keys(body.name).length < 1) {
      return left(new EntityNotEmpty('Name'));
    }

    if (Object.keys(body.description).length < 1) {
      return left(new EntityNotEmpty('Description'));
    }

    await ValidationUserId(loggedUserId, this.findUserByIdRepository);

    const filteredPlaylistCategory =
      await this.findPlaylistCategoryByIdRepository.find(id);

    if (
      Object.keys(filteredPlaylistCategory?.id ?? filteredPlaylistCategory)
        .length < 1
    ) {
      return left(new EntityNotExists('Category'));
    }

    await this.editPlaylistCategoryRepository.edit(input);

    return right(undefined);
  }
}
