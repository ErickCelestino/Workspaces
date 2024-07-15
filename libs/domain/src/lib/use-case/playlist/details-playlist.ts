import { Inject } from '@nestjs/common';
import { UseCase } from '../../base/use-case';
import { DetailsPlaylistDto, PlaylistResponseDto } from '../../dto';
import { EntityNotEmpty, EntityNotExists } from '../../error';
import {
  DetailsPlaylistRepository,
  FindPlaylistByIdRepository,
  FindUserByIdRepository,
} from '../../repository';
import { Either, left, right } from '../../shared/either';
import { ValidationPlaylistId, ValidationUserId } from '../../utils';

export class DetailsPlaylist
  implements
    UseCase<
      DetailsPlaylistDto,
      Either<EntityNotEmpty | EntityNotExists, PlaylistResponseDto>
    >
{
  constructor(
    @Inject('FindUserByIdRepository')
    private findUserByIdRepository: FindUserByIdRepository,
    @Inject('FindPlaylistByIdRepository')
    private findPlaylistByIdRepository: FindPlaylistByIdRepository,
    @Inject('DetailsPlaylistRepository')
    private detailsPlaylistRepository: DetailsPlaylistRepository
  ) {}

  async execute(
    input: DetailsPlaylistDto
  ): Promise<Either<EntityNotEmpty | EntityNotExists, PlaylistResponseDto>> {
    const { loggedUserId, playlistId } = input;

    if (Object.keys(loggedUserId).length < 1) {
      return left(new EntityNotEmpty('Logged User'));
    }

    if (Object.keys(playlistId).length < 1) {
      return left(new EntityNotEmpty('Playlist ID'));
    }

    await ValidationUserId(loggedUserId, this.findUserByIdRepository);
    await ValidationPlaylistId(playlistId, this.findPlaylistByIdRepository);

    const playlistResult = await this.detailsPlaylistRepository.details(input);

    if (Object.keys(playlistResult?.id ?? playlistResult).length < 1) {
      return left(new EntityNotExists('Playlist'));
    }

    return right(playlistResult);
  }
}