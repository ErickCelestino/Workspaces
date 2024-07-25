import { Inject } from '@nestjs/common';
import { UseCase } from '../../base/use-case';
import { FindSchedulingByIdDto } from '../../dto';
import { Scheduling } from '../../entity';
import { EntityNotEmpty, EntityNotExists } from '../../error';
import { Either, left, right } from '../../shared/either';
import {
  FindSchedulingByIdRepository,
  FindUserByIdRepository,
} from '../../repository';
import { ValidationSchedulingId, ValidationUserId } from '../../utils';

export class FindSchedulingById
  implements UseCase<FindSchedulingByIdDto, Either<EntityNotEmpty, Scheduling>>
{
  constructor(
    @Inject('FindUserByIdRepository')
    private findUserByIdRepository: FindUserByIdRepository,
    @Inject('FindSchedulingByIdRepository')
    private findSchedulingByIdRepository: FindSchedulingByIdRepository
  ) {}
  async execute(
    input: FindSchedulingByIdDto
  ): Promise<Either<EntityNotEmpty, Scheduling>> {
    const { id, loggedUserId } = input;

    if (Object.keys(id).length < 1) {
      return left(new EntityNotEmpty('Scheduling ID'));
    }

    if (Object.keys(loggedUserId).length < 1) {
      return left(new EntityNotEmpty('User ID'));
    }

    await ValidationUserId(loggedUserId, this.findUserByIdRepository);
    await ValidationSchedulingId(id, this.findSchedulingByIdRepository);

    const filteredScheduling = await this.findSchedulingByIdRepository.find(id);

    if (Object.keys(filteredScheduling).length < 1) {
      return left(new EntityNotExists('Scheduling'));
    }

    return right(filteredScheduling);
  }
}
