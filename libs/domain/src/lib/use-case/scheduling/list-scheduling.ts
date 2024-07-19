import { Inject } from '@nestjs/common';
import { UseCase } from '../../base/use-case';
import { ListSchedulingDto, ListSchedulingReponseDto } from '../../dto';
import { EntityNotEmpty } from '../../error';
import { Either, left, right } from '../../shared/either';
import {
  FindUserByIdRepository,
  ListSchedulingRepository,
} from '../../repository';
import { ValidationUserId } from '../../utils';

export class ListScheduling
  implements
    UseCase<
      ListSchedulingDto,
      Either<EntityNotEmpty, ListSchedulingReponseDto>
    >
{
  constructor(
    @Inject('FindUserByIdRepository')
    private findUserByIdRepository: FindUserByIdRepository,
    @Inject('ListSchedulingRepository')
    private listSchedulingRepository: ListSchedulingRepository
  ) {}
  async execute(
    input: ListSchedulingDto
  ): Promise<Either<EntityNotEmpty, ListSchedulingReponseDto>> {
    const { loggedUserId } = input;

    if (Object.keys(loggedUserId).length < 1) {
      return left(new EntityNotEmpty('User ID'));
    }

    await ValidationUserId(loggedUserId, this.findUserByIdRepository);

    const resultScheduling = await this.listSchedulingRepository.list(input);

    return right(resultScheduling);
  }
}
