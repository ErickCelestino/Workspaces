import { Inject } from '@nestjs/common';
import { UseCase } from '../../base/use-case';
import { FindAppByNameDto } from '../../dto';
import { App } from '../../entity';
import { EntityNotExists, InsufficientCharacters } from '../../error';
import { FindAppByNameRepository } from '../../repository';
import { Either, left, right } from '../../shared/either';

export class FindAppByName
  implements
    UseCase<
      FindAppByNameDto,
      Either<InsufficientCharacters | EntityNotExists, App[]>
    >
{
  constructor(
    @Inject('FindAppByNameRepository')
    private findAppByName: FindAppByNameRepository
  ) {}
  async execute(
    input: FindAppByNameDto
  ): Promise<Either<InsufficientCharacters | EntityNotExists, App[]>> {
    const { name } = input;

    if (Object.keys(name).length < 1) {
      return left(new InsufficientCharacters('name'));
    }

    const findedApp = await this.findAppByName.find(name);

    if (Object.keys(findedApp).length < 1) {
      left(new EntityNotExists(name));
    }
    const teste = [] as App[];
    return right(teste);
  }
}
