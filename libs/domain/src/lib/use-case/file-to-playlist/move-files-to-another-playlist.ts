import { Inject } from '@nestjs/common';
import { UseCase } from '../../base/use-case';
import { MoveFilesToAnotherPlaylistDto } from '../../dto';
import { EntityNotAssociate, EntityNotEmpty } from '../../error';
import { Either, left, right } from '../../shared/either';
import {
  ValidationContentFileId,
  ValidationPlaylistId,
  ValidationUserId,
} from '../../utils';
import {
  FindContentFileByIdRepository,
  FindFileInFileToPlaylistRepository,
  FindPlaylistByIdRepository,
  FindUserByIdRepository,
  MoveFileToAnotherPlaylistRepository,
} from '../../repository';

export class MoveFilesToAnotherPlaylist
  implements
    UseCase<
      MoveFilesToAnotherPlaylistDto,
      Either<EntityNotEmpty | EntityNotAssociate, void>
    >
{
  constructor(
    @Inject('FindUserByIdRepository')
    private findUserByIdRepository: FindUserByIdRepository,
    @Inject('FindContentFileByIdRepository')
    private findContentFileByIdRepository: FindContentFileByIdRepository,
    @Inject('FindPlaylistByIdRepository')
    private findPlaylistByIdRepository: FindPlaylistByIdRepository,
    @Inject('FindFileInFileToPlaylistRepository')
    private findFileInFileToPlaylistRepository: FindFileInFileToPlaylistRepository,
    @Inject('MoveFileToAnotherPlaylistRepository')
    private MoveFileToAnotherPlaylistRepository: MoveFileToAnotherPlaylistRepository
  ) {}

  async execute(
    input: MoveFilesToAnotherPlaylistDto
  ): Promise<Either<EntityNotEmpty | EntityNotAssociate, void>> {
    const { filesId, loggedUserId, newPlaylistId, oldPlaylistId } = input;

    if (Object.keys(filesId).length < 1) {
      return left(new EntityNotEmpty('File ID'));
    }

    if (Object.keys(loggedUserId).length < 1) {
      return left(new EntityNotEmpty('User ID'));
    }

    if (Object.keys(newPlaylistId).length < 1) {
      return left(new EntityNotEmpty('New Playlist ID'));
    }

    if (Object.keys(oldPlaylistId).length < 1) {
      return left(new EntityNotEmpty('Old Playlist ID'));
    }

    await ValidationUserId(loggedUserId, this.findUserByIdRepository);
    await ValidationPlaylistId(newPlaylistId, this.findPlaylistByIdRepository);
    await ValidationPlaylistId(oldPlaylistId, this.findPlaylistByIdRepository);

    for (const file of filesId) {
      if (Object.keys(file).length < 1) {
        return left(new EntityNotEmpty('File ID'));
      }

      await ValidationContentFileId(file, this.findContentFileByIdRepository);

      const filteredFile = await this.findFileInFileToPlaylistRepository.find({
        fileId: file,
        playlsitId: oldPlaylistId,
      });

      if (Object.keys(filteredFile).length < 1) {
        return left(new EntityNotAssociate(file));
      }

      await this.MoveFileToAnotherPlaylistRepository.move(input);
    }

    return right(undefined);
  }
}
