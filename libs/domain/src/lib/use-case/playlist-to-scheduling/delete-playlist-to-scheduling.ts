import { Inject } from '@nestjs/common';
import { UseCase } from '../../base/use-case';
import { DeletePlaylistToSchedulingDto } from '../../dto';
import { EntityNotEmpty } from '../../error';
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
    UseCase<DeletePlaylistToSchedulingDto, Either<EntityNotEmpty, void>>
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
  ): Promise<Either<EntityNotEmpty, void>> {
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

    await ValidationUserId(loggedUserId, this.findUserByIdRepository);
    await ValidationSchedulingId(
      schedulingId,
      this.findSchedulingByIdRepository
    );
    await ValidationPlaylistId(playlistId, this.findPlaylistByIdRepository);

    await this.deletePlaylistToSchedulingRepository.delete(input);

    return right(undefined);
  }
}
