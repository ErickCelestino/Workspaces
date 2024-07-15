import { Inject } from '@nestjs/common';
import { UseCase } from '../../base/use-case';
import { MoveFilesToAnotherPlaylistDto } from '../../dto';
import { EntityNotEmpty } from '../../error';
import { Either, left, right } from '../../shared/either';
import {
  ValidationContentFileId,
  ValidationPlaylistId,
  ValidationUserId,
} from '../../utils';
import {
  FindContentFileByIdRepository,
  FindPlaylistByIdRepository,
  FindUserByIdRepository,
  MoveFileToAnotherPlaylistRepository,
} from '../../repository';

export class MoveFilesToAnotherPlaylist
  implements
    UseCase<MoveFilesToAnotherPlaylistDto, Either<EntityNotEmpty, void>>
{
  constructor(
    @Inject('FindUserByIdRepository')
    private findUserByIdRepository: FindUserByIdRepository,
    @Inject('FindContentFileByIdRepository')
    private findContentFileByIdRepository: FindContentFileByIdRepository,
    @Inject('FindPlaylistByIdRepository')
    private findPlaylistByIdRepository: FindPlaylistByIdRepository,
    private MoveFileToAnotherPlaylistRepository: MoveFileToAnotherPlaylistRepository
  ) {}

  async execute(
    input: MoveFilesToAnotherPlaylistDto
  ): Promise<Either<EntityNotEmpty, void>> {
    const { filesId, loggedUserId, newPlaylistId, oldPlaylistId } = input;

    if (Object.keys(filesId).length < 1) {
      return left(new EntityNotEmpty('filesId'));
    }

    if (Object.keys(loggedUserId).length < 1) {
      return left(new EntityNotEmpty('filesId'));
    }

    if (Object.keys(newPlaylistId).length < 1) {
      return left(new EntityNotEmpty('filesId'));
    }

    if (Object.keys(oldPlaylistId).length < 1) {
      return left(new EntityNotEmpty('filesId'));
    }

    await ValidationUserId(loggedUserId, this.findUserByIdRepository);
    await ValidationPlaylistId(newPlaylistId, this.findPlaylistByIdRepository);
    await ValidationPlaylistId(oldPlaylistId, this.findPlaylistByIdRepository);

    for (const file of filesId) {
      if (Object.keys(file).length < 1) {
        return left(new EntityNotEmpty('File ID'));
      }

      await ValidationContentFileId(file, this.findContentFileByIdRepository);

      await this.MoveFileToAnotherPlaylistRepository.move(input);
    }

    return right(undefined);
  }
}
