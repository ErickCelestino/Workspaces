import { Inject } from '@nestjs/common';
import { UseCase } from '../../base/use-case';
import { AddPlaylistsToSchedulingDto } from '../../dto';
import { EntityNotCreated, EntityNotEmpty } from '../../error';
import { Either, left, right } from '../../shared/either';
import {
  AddPlaylistsToSchedulingRepository,
  FindPlaylistByIdRepository,
  FindSchedulingByIdRepository,
  FindUserByIdRepository,
} from '../../repository';
import {
  ValidationPlaylistId,
  ValidationSchedulingId,
  ValidationUserId,
} from '../../utils';

export class AddPlaylistsToScheduling
  implements
    UseCase<AddPlaylistsToSchedulingDto, Either<EntityNotEmpty, string[]>>
{
  constructor(
    @Inject('FindUserByIdRepository')
    private findUserByIdRepository: FindUserByIdRepository,
    @Inject('FindSchedulingByIdRepository')
    private findSchedulingByIdRepository: FindSchedulingByIdRepository,
    @Inject('FindPlaylistByIdRepository')
    private findPlaylistByIdRepository: FindPlaylistByIdRepository,
    @Inject('AddPlaylistsToSchedulingRepository')
    private addPlaylistsToSchedulingRepository: AddPlaylistsToSchedulingRepository
  ) {}

  async execute(
    input: AddPlaylistsToSchedulingDto
  ): Promise<Either<EntityNotEmpty, string[]>> {
    const { loggedUserId, playlistIds, schedulingId } = input;

    if (Object.keys(loggedUserId).length < 1) {
      return left(new EntityNotEmpty('User ID'));
    }

    if (Object.keys(schedulingId).length < 1) {
      return left(new EntityNotEmpty('Scheduling ID'));
    }

    if (playlistIds.length < 1) {
      return left(new EntityNotEmpty('Playlist ID'));
    }

    await ValidationUserId(loggedUserId, this.findUserByIdRepository);
    await ValidationSchedulingId(
      schedulingId,
      this.findSchedulingByIdRepository
    );

    const playlistToSchedulingList = [];

    for (const playlistId of playlistIds) {
      if (Object.keys(playlistId).length < 1) {
        return left(new EntityNotEmpty('Playlist ID'));
      }

      await ValidationPlaylistId(playlistId, this.findPlaylistByIdRepository);

      const createdPlaylistScheduling =
        await this.addPlaylistsToSchedulingRepository.add({
          schedulingId,
          playlistId,
        });

      if (Object.keys(createdPlaylistScheduling).length < 1) {
        return left(new EntityNotCreated('Playlist to Scheduling'));
      }

      playlistToSchedulingList.push(createdPlaylistScheduling);
    }

    return right(playlistToSchedulingList);
  }
}
