import { Inject } from '@nestjs/common';
import { UseCase } from '../../base/use-case';
import { ListPlaylistDto, ListPlaylistReponseDto } from '../../dto';
import { EntityNotEmpty, EntityNotExists } from '../../error';
import { Either, left, right } from '../../shared/either';
import {
  FindUserByIdRepository,
  ListPlaylistRepository,
} from '../../repository';
import { ValidationUserId } from '../../utils';

export class ListPlaylist
  implements
    UseCase<
      ListPlaylistDto,
      Either<EntityNotEmpty | EntityNotExists, ListPlaylistReponseDto>
    >
{
  constructor(
    @Inject('FindUserByIdRepository')
    private findUserByIdRepository: FindUserByIdRepository,
    @Inject('ListPlaylistRepository')
    private listPlaylistRepository: ListPlaylistRepository
  ) {}
  async execute(
    input: ListPlaylistDto
  ): Promise<Either<EntityNotEmpty | EntityNotExists, ListPlaylistReponseDto>> {
    const { loggedUserId } = input;

    if (Object.keys(loggedUserId).length < 1) {
      return left(new EntityNotEmpty('logged User ID'));
    }

    const userValidation = await ValidationUserId(
      loggedUserId,
      this.findUserByIdRepository
    );
    if (userValidation.isLeft()) {
      return left(userValidation.value);
    }

    const filteredPlaylist = await this.listPlaylistRepository.list(input);

    return right(filteredPlaylist);
  }
}
