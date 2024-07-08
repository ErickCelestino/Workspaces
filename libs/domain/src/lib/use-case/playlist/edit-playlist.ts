import { Inject } from '@nestjs/common';
import { UseCase } from '../../base/use-case';
import { EditPlaylistDto } from '../../dto';
import { EntityNotEmpty, EntityNotExists } from '../../error';
import { Either, left, right } from '../../shared/either';
import {
  EditPlaylistRepository,
  FindPlaylistByIdRepository,
  FindPlaylistCategoryByIdRepository,
  FindUserByIdRepository,
} from '../../repository';
import { ValidationPlaylistId, ValidationUserId } from '../../utils';

export class EditPlaylist
  implements UseCase<EditPlaylistDto, Either<EntityNotEmpty, void>>
{
  constructor(
    @Inject('FindUserByIdRepository')
    private findUserByIdRepository: FindUserByIdRepository,
    @Inject('FindPlaylistByIdRepository')
    private findPlaylistByIdRepository: FindPlaylistByIdRepository,
    @Inject('FindPlaylistCategoryByIdRepository')
    private findPlaylistCategoryByIdRepository: FindPlaylistCategoryByIdRepository,
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

    await ValidationUserId(loggedUserId, this.findUserByIdRepository);

    const filteredCategory = await this.findPlaylistCategoryByIdRepository.find(
      body.playlistCategoryId
    );

    if (Object.keys(filteredCategory?.id ?? filteredCategory).length < 1) {
      return left(new EntityNotExists('Category'));
    }

    await ValidationPlaylistId(id, this.findPlaylistByIdRepository);

    await this.editPlaylistRepository.edit(input);

    return right(undefined);
  }
}
