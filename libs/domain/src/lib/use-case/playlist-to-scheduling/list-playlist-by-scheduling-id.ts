import { Inject } from '@nestjs/common';
import { UseCase } from '../../base/use-case';
import {
  ListPlaylistBySchedulingIdDto,
  ListPlaylistReponseDto,
} from '../../dto';
import { EntityNotEmpty } from '../../error';
import { Either, left, right } from '../../shared/either';
import {
  FindSchedulingByIdRepository,
  FindUserByIdRepository,
  ListPlaylistBySchedulingIdRepository,
} from '../../repository';
import { ValidationSchedulingId, ValidationUserId } from '../../utils';

export class ListPlaylistBySchedulingId
  implements
    UseCase<
      ListPlaylistBySchedulingIdDto,
      Either<EntityNotEmpty, ListPlaylistReponseDto>
    >
{
  constructor(
    @Inject('FindUserByIdRepository')
    private findUserByIdRepository: FindUserByIdRepository,
    @Inject('FindSchedulingByIdRepository')
    private findSchedulingByIdRepository: FindSchedulingByIdRepository,
    @Inject('ListPlaylistBySchedulingIdRepository')
    private listPlaylistBySchedulingIdRepository: ListPlaylistBySchedulingIdRepository
  ) {}
  async execute(
    input: ListPlaylistBySchedulingIdDto
  ): Promise<Either<EntityNotEmpty, ListPlaylistReponseDto>> {
    const { id, loggedUserId } = input;

    if (Object.keys(id).length < 1) {
      return left(new EntityNotEmpty('Scheduling ID'));
    }

    if (Object.keys(loggedUserId).length < 1) {
      return left(new EntityNotEmpty('User ID'));
    }

    await ValidationUserId(loggedUserId, this.findUserByIdRepository);
    await ValidationSchedulingId(id, this.findSchedulingByIdRepository);

    const filteredPlaylistToScheduling =
      await this.listPlaylistBySchedulingIdRepository.list(input);

    return right(filteredPlaylistToScheduling);
  }
}