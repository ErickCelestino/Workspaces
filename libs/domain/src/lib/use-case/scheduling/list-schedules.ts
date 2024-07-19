import { Inject } from '@nestjs/common';
import { UseCase } from '../../base/use-case';
import { ListSchedulesDto, ListSchedulesReponseDto } from '../../dto';
import { EntityNotEmpty } from '../../error';
import { Either, left, right } from '../../shared/either';
import {
  FindUserByIdRepository,
  ListSchedulesRepository,
} from '../../repository';
import { ValidationUserId } from '../../utils';

export class ListSchedules
  implements
    UseCase<ListSchedulesDto, Either<EntityNotEmpty, ListSchedulesReponseDto>>
{
  constructor(
    @Inject('FindUserByIdRepository')
    private findUserByIdRepository: FindUserByIdRepository,
    @Inject('ListSchedulesRepository')
    private listSchedulingRepository: ListSchedulesRepository
  ) {}
  async execute(
    input: ListSchedulesDto
  ): Promise<Either<EntityNotEmpty, ListSchedulesReponseDto>> {
    const { loggedUserId } = input;

    if (Object.keys(loggedUserId).length < 1) {
      return left(new EntityNotEmpty('User ID'));
    }

    await ValidationUserId(loggedUserId, this.findUserByIdRepository);

    const resultScheduling = await this.listSchedulingRepository.list(input);

    return right(resultScheduling);
  }
}
