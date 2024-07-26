import { Inject } from '@nestjs/common';
import { UseCase } from '../../base/use-case';
import { DeletePlaylistToSchedulingDto } from '../../dto';
import { EntityNotEmpty, EntityNotExists } from '../../error';
import { Either, left, right } from '../../shared/either';
import {
  DeletePlaylistToSchedulingRepository,
  FindPlaylistByIdRepository,
  FindSchedulingByIdRepository,
  FindUserByIdRepository,
} from '../../repository';
import {
  ValidationPlaylistId,
  ValidationSchedulingId,
  ValidationUserId,
} from '../../utils';

export class DeletePlaylistToScheduling
  implements
    UseCase<
      DeletePlaylistToSchedulingDto,
      Either<EntityNotEmpty | EntityNotExists, void>
    >
{
  constructor(
    @Inject('FindUserByIdRepository')
    private findUserByIdRepository: FindUserByIdRepository,
    @Inject('FindSchedulingByIdRepository')
    private findSchedulingByIdRepository: FindSchedulingByIdRepository,
    @Inject('FindPlaylistByIdRepository')
    private findPlaylistByIdRepository: FindPlaylistByIdRepository,
    @Inject('DeletePlaylistToSchedulingRepository')
    private deletePlaylistToSchedulingRepository: DeletePlaylistToSchedulingRepository
  ) {}

  async execute(
    input: DeletePlaylistToSchedulingDto
  ): Promise<Either<EntityNotEmpty | EntityNotExists, void>> {
    const { playlistId, schedulingId, loggedUserId } = input;

    if (Object.keys(loggedUserId).length < 1) {
      return left(new EntityNotEmpty('User ID'));
    }

    if (Object.keys(schedulingId).length < 1) {
      return left(new EntityNotEmpty('Scheduling ID'));
    }

    if (Object.keys(playlistId).length < 1) {
      return left(new EntityNotEmpty('Playlist ID'));
    }

    const userValidation = await ValidationUserId(
      loggedUserId,
      this.findUserByIdRepository
    );
    if (userValidation.isLeft()) {
      return userValidation;
    }

    const schedulingValidation = await ValidationSchedulingId(
      schedulingId,
      this.findSchedulingByIdRepository
    );
    if (schedulingValidation.isLeft()) {
      return schedulingValidation as Either<EntityNotExists, void>;
    }

    const playlistValidation = await ValidationPlaylistId(
      playlistId,
      this.findPlaylistByIdRepository
    );
    if (playlistValidation.isLeft()) {
      return playlistValidation as Either<EntityNotExists, void>;
    }

    await this.deletePlaylistToSchedulingRepository.delete(input);

    return right(undefined);
  }
}
