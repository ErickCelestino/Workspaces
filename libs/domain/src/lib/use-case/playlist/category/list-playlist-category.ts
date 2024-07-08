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
import { ValidationUserId } from '../../../utils';

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

    await ValidationUserId(loggedUserId, this.findUserByIdRepository);

    const listCategory = await this.listPlaylistCategoryRepository.list(input);

    return right(listCategory);
  }
}
