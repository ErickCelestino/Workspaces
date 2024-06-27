import { Inject } from '@nestjs/common';
import { UseCase } from '../../../base/use-case';
import { CreatePlaylistCategoryDto } from '../../../dto';
import {
  EntityAlreadyExists,
  EntityNotCreated,
  EntityNotEmpty,
  EntityNotExists,
} from '../../../error';
import { Either, left, right } from '../../../shared/either';
import {
  CreatePlaylistCategoryRepository,
  FindPlaylistCategoryByNameRepository,
  FindUserByIdRepository,
} from '../../../repository';

export class CreatePlaylistCategory
  implements
    UseCase<
      CreatePlaylistCategoryDto,
      Either<
        | EntityNotEmpty
        | EntityNotExists
        | EntityNotCreated
        | EntityAlreadyExists,
        string
      >
    >
{
  constructor(
    @Inject('FindUserByIdRepository')
    private findUserByIdRepository: FindUserByIdRepository,
    @Inject('CreatePlaylistCategoryRepository')
    private createPlaylistCategoryRepository: CreatePlaylistCategoryRepository,
    @Inject('FindPlaylistCategoryByNameRepository')
    private findPlaylistCategoryRepository: FindPlaylistCategoryByNameRepository
  ) {}
  async execute(
    input: CreatePlaylistCategoryDto
  ): Promise<
    Either<
      EntityNotEmpty | EntityNotExists | EntityNotCreated | EntityAlreadyExists,
      string
    >
  > {
    const { loggedUserId, name, description } = input;

    if (Object.keys(loggedUserId).length < 1) {
      return left(new EntityNotEmpty('logged user ID'));
    }

    if (Object.keys(name).length < 1) {
      return left(new EntityNotEmpty('name'));
    }

    if (Object.keys(description).length < 1) {
      return left(new EntityNotEmpty('description'));
    }

    const filteredUser = await this.findUserByIdRepository.find(loggedUserId);

    if (Object.keys(filteredUser?.userId ?? filteredUser).length < 1) {
      return left(new EntityNotExists('User'));
    }

    const filteredPlaylistCategory =
      await this.findPlaylistCategoryRepository.find({
        loggedUserId,
        name,
      });

    if (
      Object.keys(filteredPlaylistCategory?.id ?? filteredPlaylistCategory)
        .length > 0
    ) {
      return left(new EntityAlreadyExists('Category'));
    }

    const createdCategory = await this.createPlaylistCategoryRepository.create(
      input
    );

    if (Object.keys(createdCategory).length < 1) {
      return left(new EntityNotCreated('Playlist Category'));
    }

    return right(createdCategory);
  }
}
