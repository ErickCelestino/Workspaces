import { Inject } from '@nestjs/common';
import { UseCase } from '../../../base/use-case';
import { CreatePlaylistCategoryDto } from '../../../dto';
import {
  EntityNotCreated,
  EntityNotEmpty,
  EntityNotExists,
} from '../../../error';
import { Either, left, right } from '../../../shared/either';
import {
  CreatePlaylistCategoryRepository,
  FindUserByIdRepository,
} from '../../../repository';

export class CreatePlaylistCategory
  implements
    UseCase<
      CreatePlaylistCategoryDto,
      Either<EntityNotEmpty | EntityNotExists | EntityNotCreated, string>
    >
{
  constructor(
    @Inject('FindUserByIdRepository')
    private findUserByIdRepository: FindUserByIdRepository,
    @Inject('CreatePlaylistCategoryRepository')
    private createPlaylistCategoryRepository: CreatePlaylistCategoryRepository
  ) {}
  async execute(
    input: CreatePlaylistCategoryDto
  ): Promise<
    Either<EntityNotEmpty | EntityNotExists | EntityNotCreated, string>
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

    const createdCategory = await this.createPlaylistCategoryRepository.create(
      input
    );

    if (Object.keys(createdCategory).length < 1) {
      return left(new EntityNotCreated('Playlist Category'));
    }

    return right(createdCategory);
  }
}
