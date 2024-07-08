import { Inject } from '@nestjs/common';
import { UseCase } from '../../base/use-case';
import { DeletePlaylistDto } from '../../dto';
import { EntityNotEmpty, EntityNotExists } from '../../error';
import { Either, left, right } from '../../shared/either';
import {
  DeletePlaylistRepoistory,
  FindPlaylistByIdRepository,
  FindUserByIdRepository,
} from '../../repository';
import { ValidationUserId } from '../../utils';

export class DeletePlaylist
  implements UseCase<DeletePlaylistDto, Either<EntityNotEmpty, void>>
{
  constructor(
    @Inject('FindUserByIdRepository')
    private findUserByIdRepository: FindUserByIdRepository,
    @Inject('FindPlaylistByIdRepository')
    private findPlaylistByIdRepository: FindPlaylistByIdRepository,
    @Inject('DeletePlaylistRepoistory')
    private deletePlaylistRepository: DeletePlaylistRepoistory
  ) {}
  async execute(
    input: DeletePlaylistDto
  ): Promise<Either<EntityNotEmpty, void>> {
    const { id, loggedUserId } = input;

    if (Object.keys(id).length < 1) {
      return left(new EntityNotEmpty('ID'));
    }

    if (Object.keys(loggedUserId).length < 1) {
      return left(new EntityNotEmpty('Logged User'));
    }

    await ValidationUserId(loggedUserId, this.findUserByIdRepository);

    const filteredPlaylist = await this.findPlaylistByIdRepository.find(id);

    if (Object.keys(filteredPlaylist?.id ?? filteredPlaylist).length < 1) {
      return left(new EntityNotExists('Playlist'));
    }

    await this.deletePlaylistRepository.delete(id);

    return right(undefined);
  }
}
