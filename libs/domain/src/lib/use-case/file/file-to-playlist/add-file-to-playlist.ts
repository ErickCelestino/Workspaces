import { Inject } from '@nestjs/common';
import { UseCase } from '../../../base/use-case';
import { AddFileToPlaylistDto } from '../../../dto';
import { EntityNotCreated, EntityNotEmpty } from '../../../error';
import { Either, left, right } from '../../../shared/either';
import {
  AddFileToPlaylistRepository,
  FindContentFileByIdRepository,
  FindPlaylistByIdRepository,
  FindUserByIdRepository,
} from '../../../repository';
import {
  ValidationContentFileId,
  ValidationPlaylistId,
  ValidationUserId,
} from '../../../utils';

export class AddFileToPlaylist
  implements UseCase<AddFileToPlaylistDto, Either<EntityNotEmpty, string[]>>
{
  constructor(
    @Inject('FindUserByIdRepository')
    private findUserByIdRepository: FindUserByIdRepository,
    @Inject('FindContentFileByIdRepository')
    private findContentFileByIdRepository: FindContentFileByIdRepository,
    @Inject('FindPlaylistByIdRepository')
    private findPlaylistByIdRepository: FindPlaylistByIdRepository,
    @Inject('AddFileToPlaylistRepository')
    private addFileToPlaylistRepository: AddFileToPlaylistRepository
  ) {}
  async execute(
    input: AddFileToPlaylistDto
  ): Promise<Either<EntityNotEmpty, string[]>> {
    const { loggedUserId, filesId, playlistId } = input;

    if (Object.keys(loggedUserId).length < 1) {
      return left(new EntityNotEmpty('User ID'));
    }

    if (Object.keys(playlistId).length < 1) {
      return left(new EntityNotEmpty('Playlist ID'));
    }

    await ValidationUserId(loggedUserId, this.findUserByIdRepository);

    for (const file of filesId) {
      if (Object.keys(file).length < 1) {
        return left(new EntityNotEmpty('File ID'));
      }

      await ValidationContentFileId(file, this.findContentFileByIdRepository);
    }

    await ValidationPlaylistId(playlistId, this.findPlaylistByIdRepository);

    const filteredResult = await this.addFileToPlaylistRepository.add(input);

    if (Object.keys(filteredResult).length < 1) {
      return left(new EntityNotCreated('File to Playlist'));
    }

    return right(filteredResult);
  }
}
