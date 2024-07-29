import { Inject } from '@nestjs/common';
import { UseCase } from '../../base/use-case';
import { Either, left, right } from '../../shared/either';
import { BtrinSanitizeRepository, ListUserRepository } from '../../repository';
import { ListUserDto, ListUserResponseDto } from '../../dto';
import { SyntaxError } from '../../error';

export class ListUser
  implements UseCase<ListUserDto, Either<SyntaxError, ListUserResponseDto>>
{
  constructor(
    @Inject('ListUserRepository')
    private listUserRepository: ListUserRepository,
    @Inject('BtrinSanatizeRepository')
    private btrinSanitizeRepository: BtrinSanitizeRepository
  ) {}

  async execute(
    input: ListUserDto
  ): Promise<Either<SyntaxError, ListUserResponseDto>> {
    const sanitizedInput = await this.btrinSanitizeRepository.btrin(
      input.input
    );
    if (sanitizedInput === undefined) {
      return left(new SyntaxError());
    }

    const listUserResult = await this.listUserRepository.list(input);

    return right(listUserResult);
  }
}
