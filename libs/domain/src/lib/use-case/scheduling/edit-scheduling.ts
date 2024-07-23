import { Inject } from '@nestjs/common';
import { UseCase } from '../../base/use-case';
import { EditSchedulingDto } from '../../dto';
import {
  EntityNotConverted,
  EntityNotEmpty,
  StartTimeCannotBeGreaterEndTime,
} from '../../error';
import { Either, left, right } from '../../shared/either';
import {
  ConvertStringInTimeRepository,
  EditSchedulingRepository,
  FindSchedulingByIdRepository,
  FindUserByIdRepository,
} from '../../repository';
import { ValidationSchedulingId, ValidationUserId } from '../../utils';

export class EditScheduling
  implements UseCase<EditSchedulingDto, Either<EntityNotEmpty, void>>
{
  constructor(
    @Inject('FindUserByIdRepository')
    private findUserByIdRepository: FindUserByIdRepository,
    @Inject('FindSchedulingByIdRepository')
    private findSchedulingByIdRepository: FindSchedulingByIdRepository,
    @Inject('ConvertStringInTimeRepository')
    private convertStringInTimeRepository: ConvertStringInTimeRepository,
    @Inject('EditSchedulingRepository')
    private editSchedulingRepository: EditSchedulingRepository
  ) {}

  private isValidDate = (date: unknown) => {
    return date instanceof Date && !isNaN(date.getTime());
  };

  async execute(
    input: EditSchedulingDto
  ): Promise<Either<EntityNotEmpty, void>> {
    const {
      id,
      body: { endTime, name, priority, startTime, lopping },
      loggedUserId,
    } = input;

    if (Object.keys(id).length < 1) {
      return left(new EntityNotEmpty('id'));
    }

    if (Object.keys(name).length < 1) {
      return left(new EntityNotEmpty('name'));
    }

    if (Object.keys(endTime).length < 1) {
      return left(new EntityNotEmpty('end time'));
    }

    if (Object.keys(startTime).length < 1) {
      return left(new EntityNotEmpty('start time'));
    }

    if (Object.keys(loggedUserId).length < 1) {
      return left(new EntityNotEmpty('User id'));
    }

    if (Object.keys(priority).length < 1) {
      return left(new EntityNotEmpty('priority'));
    }

    const convertedStartTime = await this.convertStringInTimeRepository.convert(
      `${startTime}`
    );
    const convertedEndTime = await this.convertStringInTimeRepository.convert(
      `${endTime}`
    );

    if (
      !this.isValidDate(convertedStartTime) ||
      !this.isValidDate(convertedEndTime)
    ) {
      return left(new EntityNotConverted('Start Time or End Time'));
    }

    if (convertedStartTime > convertedEndTime) {
      return left(new StartTimeCannotBeGreaterEndTime('Start Time'));
    }

    await ValidationUserId(loggedUserId, this.findUserByIdRepository);
    await ValidationSchedulingId(id, this.findSchedulingByIdRepository);

    await this.editSchedulingRepository.edit({
      body: {
        name,
        priority,
        startTime: convertedStartTime,
        endTime: convertedEndTime,
        lopping,
      },
      id,
      loggedUserId,
    });

    return right(undefined);
  }
}
