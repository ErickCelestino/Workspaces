import { Inject } from '@nestjs/common';
import { UseCase } from '../../base/use-case';
import { FindFilesByPlaylistDto } from '../../dto';
import { ContentFile } from '../../entity';
import { EntityNotEmpty } from '../../error';
import {
  FindFilesByPlaylistRepository,
  FindPlaylistByIdRepository,
  FindUserByIdRepository,
} from '../../repository';
import { Either, left, right } from '../../shared/either';
import { ValidationPlaylistId, ValidationUserId } from '../../utils';

export class FindFilesByPlaylist
  implements
    UseCase<FindFilesByPlaylistDto, Either<EntityNotEmpty, ContentFile[]>>
{
  constructor(
    @Inject('FindUserByIdRepository')
    private findUserByIdRepository: FindUserByIdRepository,
    @Inject('FindPlaylistByIdRepository')
    private findPlaylistByIdRepository: FindPlaylistByIdRepository,
    @Inject('FindFilesByPlaylistRepository')
    private findFilesByPlaylistRepository: FindFilesByPlaylistRepository
  ) {}

  async execute(
    input: FindFilesByPlaylistDto
  ): Promise<Either<EntityNotEmpty, ContentFile[]>> {
    const { idPlaylist, loggedUserId } = input;
    if (Object.keys(loggedUserId).length < 1) {
      return left(new EntityNotEmpty('Logged User'));
    }

    if (Object.keys(idPlaylist).length < 1) {
      return left(new EntityNotEmpty('Playlist ID'));
    }

    await ValidationUserId(loggedUserId, this.findUserByIdRepository);
    await ValidationPlaylistId(idPlaylist, this.findPlaylistByIdRepository);

    const resultedFiles = await this.findFilesByPlaylistRepository.find(input);

    return right(resultedFiles);
  }
}
