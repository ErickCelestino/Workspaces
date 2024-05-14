import { Inject } from '@nestjs/common';
import { UseCase } from '../../base/use-case';
import { Either, left, right } from '../../shared/either';
import { BtrinSanitizeRepository, ListUserRepository } from '../../repository';
import { UserList } from '../../entity';

export class ListUser
  implements UseCase<string, Either<SyntaxError, UserList[]>>
{
  constructor(
    @Inject('ListUserRepository')
    private listUserRepository: ListUserRepository,
    @Inject('BtrinSanatizeRepository')
    private btrinSanitizeRepository: BtrinSanitizeRepository
  ) {}

  async execute(input: string): Promise<Either<SyntaxError, UserList[]>> {
    const sanitizedInput = this.btrinSanitizeRepository.btrin(input);
    if (sanitizedInput === undefined) {
      return left(new SyntaxError());
    }

    const listUserResult = await this.listUserRepository.list(sanitizedInput);

    return right(listUserResult);
  }
}
