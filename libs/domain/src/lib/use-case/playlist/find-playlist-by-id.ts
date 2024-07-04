import { Inject } from '@nestjs/common';
import { UseCase } from '../../base/use-case';
import { FindPlaylistByIdDto } from '../../dto';
import { Playlist } from '../../entity';
import {
  EntityAlreadyExists,
  EntityNotEmpty,
  EntityNotExists,
} from '../../error';
import { Either, left, right } from '../../shared/either';
import {
  FindPlaylistByIdRepository,
  FindUserByIdRepository,
} from '../../repository';

export class FindPlaylistById
  implements
    UseCase<
      FindPlaylistByIdDto,
      Either<EntityNotEmpty | EntityNotExists, Playlist>
    >
{
  constructor(
    @Inject('FindUserByIdRepository')
    private findUserByIdRepository: FindUserByIdRepository,
    @Inject('FindPlaylistByIdRepository')
    private findPlaylistByIdRepository: FindPlaylistByIdRepository
  ) {}
  async execute(
    input: FindPlaylistByIdDto
  ): Promise<Either<EntityNotEmpty | EntityNotExists, Playlist>> {
    const { id, loggedUserId } = input;

    if (Object.keys(id).length < 1) {
      return left(new EntityNotEmpty('ID'));
    }

    if (Object.keys(loggedUserId).length < 1) {
      return left(new EntityNotEmpty('User ID'));
    }

    const filteredUser = await this.findUserByIdRepository.find(loggedUserId);

    if (Object.keys(filteredUser?.userId ?? filteredUser).length < 1) {
      return left(new EntityNotExists('User'));
    }

    const filteredPlaylist = await this.findPlaylistByIdRepository.find(id);

    if (Object.keys(filteredPlaylist?.id ?? filteredPlaylist).length < 1) {
      return left(new EntityNotExists('Playlist'));
    }

    return right(filteredPlaylist);
  }
}
