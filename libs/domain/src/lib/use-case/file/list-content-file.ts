import { UseCase } from '../../base/use-case';
import { ListContentFileDto } from '../../dto';
import { File } from '../../entity';
import { EntityNotEmpty } from '../../error';
import { ListContentFileRepository } from '../../repository';
import { Either, left, right } from '../../shared/either';

export class ListContentFile
  implements UseCase<ListContentFileDto, Either<EntityNotEmpty, File[]>>
{
  constructor(private listContentFileRepository: ListContentFileRepository) {}

  async execute(
    input: ListContentFileDto
  ): Promise<Either<EntityNotEmpty, File[]>> {
    const { directoryId, loggedUserId } = input;

    if (Object.keys(directoryId).length < 1) {
      return left(new EntityNotEmpty('directory ID'));
    }

    if (Object.keys(loggedUserId).length < 1) {
      return left(new EntityNotEmpty('logged user ID'));
    }

    const resultList = await this.listContentFileRepository.list(input);

    return right(resultList);
  }
}
