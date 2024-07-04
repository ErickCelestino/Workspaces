import { Inject } from '@nestjs/common';
import { UseCase } from '../../base/use-case';
import { EditPlaylistDto } from '../../dto';
import { EntityNotEmpty, EntityNotExists } from '../../error';
import { Either, left, right } from '../../shared/either';
import {
  EditPlaylistRepository,
  FindPlaylistByIdRepository,
  FindUserByIdRepository,
} from '../../repository';

export class EditPlaylist
  implements UseCase<EditPlaylistDto, Either<EntityNotEmpty, void>>
{
  constructor(
    @Inject('FindUserByIdRepository')
    private findUserByIdRepository: FindUserByIdRepository,
    @Inject('FindPlaylistByIdRepository')
    private findPlaylistByIdRepository: FindPlaylistByIdRepository,
    @Inject('EditPlaylistRepository')
    private editPlaylistRepository: EditPlaylistRepository
  ) {}
  async execute(input: EditPlaylistDto): Promise<Either<EntityNotEmpty, void>> {
    const { id, loggedUserId, body } = input;

    if (Object.keys(id).length < 1) {
      return left(new EntityNotEmpty('ID'));
    }

    if (Object.keys(loggedUserId).length < 1) {
      return left(new EntityNotEmpty('User ID'));
    }

    if (Object.keys(body.name ?? body).length < 1) {
      return left(new EntityNotEmpty('Name'));
    }

    if (Object.keys(body.playlistCategoryId).length < 1) {
      return left(new EntityNotEmpty('Playlist'));
    }

    const filteredUser = await this.findUserByIdRepository.find(loggedUserId);

    if (Object.keys(filteredUser?.userId ?? filteredUser).length < 1) {
      return left(new EntityNotExists('User'));
    }

    const filteredPlaylist = await this.findPlaylistByIdRepository.find(id);

    if (Object.keys(filteredPlaylist?.id ?? filteredPlaylist).length < 1) {
      return left(new EntityNotExists('Playlist'));
    }

    await this.editPlaylistRepository.edit(input);

    return right(undefined);
  }
}
