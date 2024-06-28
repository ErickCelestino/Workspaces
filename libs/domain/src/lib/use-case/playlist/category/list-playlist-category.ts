import { Inject } from '@nestjs/common';
import { UseCase } from '../../../base/use-case';
import {
  ListPlaylistCategoryDto,
  ListPlaylistCategoryReponseDto,
} from '../../../dto';
import { EntityNotEmpty, EntityNotExists } from '../../../error';
import { Either, left, right } from '../../../shared/either';
import {
  FindUserByIdRepository,
  ListPlaylistCategoryRepository,
} from '../../../repository';

export class ListPlaylistCategory
  implements
    UseCase<
      ListPlaylistCategoryDto,
      Either<EntityNotEmpty | EntityNotExists, ListPlaylistCategoryReponseDto>
    >
{
  constructor(
    @Inject('FindUserByIdRepository')
    private findUserByIdRepository: FindUserByIdRepository,
    @Inject('ListPlaylistCategoryRepository')
    private listPlaylistCategoryRepository: ListPlaylistCategoryRepository
  ) {}

  async execute(
    input: ListPlaylistCategoryDto
  ): Promise<
    Either<EntityNotEmpty | EntityNotExists, ListPlaylistCategoryReponseDto>
  > {
    const { loggedUserId } = input;

    if (Object.keys(loggedUserId).length < 1) {
      return left(new EntityNotEmpty('logged User ID'));
    }

    const filteredUser = await this.findUserByIdRepository.find(loggedUserId);

    if (Object.keys(filteredUser?.userId ?? filteredUser).length < 1) {
      return left(new EntityNotExists('User'));
    }

    const listCategory = await this.listPlaylistCategoryRepository.list(input);

    return right(listCategory);
  }
}
