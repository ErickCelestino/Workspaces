import { Inject } from '@nestjs/common';
import { UseCase } from '../../base/use-case';
import { CreateSchedulingDto } from '../../dto';
import {
  EntityAlreadyExists,
  EntityNotCreated,
  EntityNotEmpty,
  EntityNotNegativeNumber,
} from '../../error';
import {
  CreateSchedulingRepository,
  FindSchedulingByNameRepository,
  FindUserByIdRepository,
} from '../../repository';
import { Either, left, right } from '../../shared/either';
import { ValidationUserId } from '../../utils';

export class CreateScheduling
  implements
    UseCase<
      CreateSchedulingDto,
      Either<
        | EntityNotEmpty
        | EntityNotNegativeNumber
        | EntityAlreadyExists
        | EntityNotCreated,
        string
      >
    >
{
  constructor(
    @Inject('FindUserByIdRepository')
    private findUserByIdRepository: FindUserByIdRepository,
    @Inject('FindSchedulingByNameRepository')
    private findSchedulingByNameRepository: FindSchedulingByNameRepository,
    @Inject('CreateSchedulingRepository')
    private createSchedulingRepository: CreateSchedulingRepository
  ) {}

  async execute(
    input: CreateSchedulingDto
  ): Promise<
    Either<
      | EntityNotEmpty
      | EntityNotNegativeNumber
      | EntityAlreadyExists
      | EntityNotCreated,
      string
    >
  > {
    const { loggedUserId, name, priority, startTime, endTime } = input;

    if (Object.keys(loggedUserId).length < 1) {
      return left(new EntityNotEmpty('User ID'));
    }

    if (Object.keys(name).length < 1) {
      return left(new EntityNotEmpty('Name'));
    }

    if (priority < 0) {
      return left(new EntityNotNegativeNumber('Priority'));
    }

    if (Object.keys(startTime).length < 1) {
      return left(new EntityNotEmpty('Start Time'));
    }

    if (Object.keys(endTime).length < 1) {
      return left(new EntityNotEmpty('End Time'));
    }

    await ValidationUserId(loggedUserId, this.findUserByIdRepository);

    const filteredScheduling = await this.findSchedulingByNameRepository.find({
      name,
      loggedUserId,
    });

    if (Object.keys(filteredScheduling).length > 0) {
      return left(new EntityAlreadyExists('Scheduling'));
    }

    const createdSchedulingId = await this.createSchedulingRepository.create(
      input
    );

    if (Object.keys(createdSchedulingId).length < 1) {
      return left(new EntityNotCreated('Scheduling'));
    }

    return right(createdSchedulingId);
  }
}
