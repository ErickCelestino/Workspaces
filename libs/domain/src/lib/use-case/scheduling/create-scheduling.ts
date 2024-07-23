import { Inject } from '@nestjs/common';
import { UseCase } from '../../base/use-case';
import { CreateSchedulingDto } from '../../dto';
import {
  EntityAlreadyExists,
  EntityNotConverted,
  EntityNotCreated,
  EntityNotEmpty,
  EntityNotNegativeNumber,
  StartTimeCannotBeGreaterEndTime,
} from '../../error';
import {
  ConvertStringInTimeRepository,
  CreateSchedulingRepository,
  FindSchedulingByNameRepository,
  FindUserByIdRepository,
} from '../../repository';
import { Either, left, right } from '../../shared/either';
import { ValidationStartEndTime, ValidationUserId } from '../../utils';

export class CreateScheduling
  implements
    UseCase<
      CreateSchedulingDto,
      Either<
        | EntityNotEmpty
        | EntityNotNegativeNumber
        | EntityAlreadyExists
        | EntityNotCreated
        | EntityNotConverted
        | StartTimeCannotBeGreaterEndTime,
        string
      >
    >
{
  constructor(
    @Inject('FindUserByIdRepository')
    private findUserByIdRepository: FindUserByIdRepository,
    @Inject('FindSchedulingByNameRepository')
    private findSchedulingByNameRepository: FindSchedulingByNameRepository,
    @Inject('ConvertStringInTimeRepository')
    private convertStringInTimeRepository: ConvertStringInTimeRepository,
    @Inject('CreateSchedulingRepository')
    private createSchedulingRepository: CreateSchedulingRepository
  ) {}

  private isValidDate = (date: unknown) => {
    return date instanceof Date && !isNaN(date.getTime());
  };

  async execute(
    input: CreateSchedulingDto
  ): Promise<
    Either<
      | EntityNotEmpty
      | EntityNotNegativeNumber
      | EntityAlreadyExists
      | EntityNotCreated
      | EntityNotConverted
      | StartTimeCannotBeGreaterEndTime,
      string
    >
  > {
    const {
      loggedUserId,
      body: { name, priority, startTime, endTime, lopping },
    } = input;

    if (Object.keys(loggedUserId).length < 1) {
      return left(new EntityNotEmpty('User ID'));
    }

    if (Object.keys(name).length < 1) {
      return left(new EntityNotEmpty('Name'));
    }

    if (parseInt(priority) < 0) {
      return left(new EntityNotNegativeNumber('Priority'));
    }

    if (Object.keys(startTime).length < 1) {
      return left(new EntityNotEmpty('Start Time'));
    }

    if (Object.keys(endTime).length < 1) {
      return left(new EntityNotEmpty('End Time'));
    }

    const convertedStartTime = await this.convertStringInTimeRepository.convert(
      `${startTime}`
    );
    const convertedEndTime = await this.convertStringInTimeRepository.convert(
      `${endTime}`
    );

    await ValidationStartEndTime(convertedStartTime, convertedEndTime);
    await ValidationUserId(loggedUserId, this.findUserByIdRepository);

    const filteredScheduling = await this.findSchedulingByNameRepository.find({
      name,
      loggedUserId,
    });

    if (Object.keys(filteredScheduling.id ?? filteredScheduling).length > 0) {
      return left(new EntityAlreadyExists('Scheduling'));
    }

    const createdSchedulingId = await this.createSchedulingRepository.create({
      loggedUserId,
      body: {
        name,
        priority,
        startTime: convertedStartTime,
        endTime: convertedEndTime,
        lopping,
      },
    });

    if (Object.keys(createdSchedulingId).length < 1) {
      return left(new EntityNotCreated('Scheduling'));
    }

    return right(createdSchedulingId);
  }
}
