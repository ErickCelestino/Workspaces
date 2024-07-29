import { Inject } from '@nestjs/common';
import { UseCase } from '../../base/use-case';
import { CreatePlaylistDto } from '../../dto';
import {
  EntityAlreadyExists,
  EntityNotCreated,
  EntityNotEmpty,
  EntityNotExists,
} from '../../error';
import { Either, left, right } from '../../shared/either';
import {
  CreatePlaylistRepository,
  FindPlaylistByNameRepository,
  FindPlaylistCategoryByIdRepository,
  FindUserByIdRepository,
} from '../../repository';
import { ValidationPlaylistCategoryId, ValidationUserId } from '../../utils';

export class CreatePlaylist
  implements
    UseCase<
      CreatePlaylistDto,
      Either<
        | EntityNotEmpty
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
    @Inject('FindPlaylistCategoryByIdRepository')
    private findPlaylistCategoryByIdRepository: FindPlaylistCategoryByIdRepository,
    @Inject('FindPlaylistByNameRepository')
    private findPlaylistByNameRepository: FindPlaylistByNameRepository,
    @Inject('CreatePlaylistRepository')
    private createPlaylistRepository: CreatePlaylistRepository
  ) {}
  async execute(
    input: CreatePlaylistDto
  ): Promise<
    Either<
      EntityNotEmpty | EntityNotExists | EntityAlreadyExists | EntityNotCreated,
      string
    >
  > {
    const { loggedUserId, playlistCategoryId, name } = input;

    if (Object.keys(loggedUserId).length < 1) {
      return left(new EntityNotEmpty('Logged User'));
    }

    if (Object.keys(playlistCategoryId).length < 1) {
      return left(new EntityNotEmpty('Playlist Category'));
    }

    if (Object.keys(name).length < 1) {
      return left(new EntityNotEmpty('Name'));
    }

    const userValidation = await ValidationUserId(
      loggedUserId,
      this.findUserByIdRepository
    );

    if (userValidation.isLeft()) {
      return left(userValidation.value);
    }
    const playlistCategoryValidation = await ValidationPlaylistCategoryId(
      playlistCategoryId,
      this.findPlaylistCategoryByIdRepository
    );

    if (playlistCategoryValidation.isLeft()) {
      return left(playlistCategoryValidation.value);
    }

    const filteredPlaylist = await this.findPlaylistByNameRepository.find({
      loggedUserId,
      name,
    });

    if (Object.keys(filteredPlaylist?.id ?? filteredPlaylist).length > 0) {
      return left(new EntityAlreadyExists('Playlist'));
    }

    const createdPlaylist = await this.createPlaylistRepository.create(input);

    if (Object.keys(createdPlaylist).length < 1) {
      return left(new EntityNotCreated('Playlist'));
    }

    return right(createdPlaylist);
  }
}
