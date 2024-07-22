import { Inject } from '@nestjs/common';
import { UseCase } from '../../base/use-case';
import { EditSchedulingDto } from '../../dto';
import { EntityNotEmpty } from '../../error';
import { Either, left, right } from '../../shared/either';
import {
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
    @Inject('EditSchedulingRepository')
    private editSchedulingRepository: EditSchedulingRepository
  ) {}
  async execute(
    input: EditSchedulingDto
  ): Promise<Either<EntityNotEmpty, void>> {
    const {
      body: { endTime, id, name, priority, startTime },
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

    await ValidationUserId(loggedUserId, this.findUserByIdRepository);
    await ValidationSchedulingId(id, this.findSchedulingByIdRepository);

    await this.editSchedulingRepository.edit(input);

    return right(undefined);
  }
}
