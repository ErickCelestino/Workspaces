import { UseCase } from '../../base/use-case';
import { CreateUserDto } from '../../dto';
import { FilterByEmailOrNicknameDto } from '../../dto/user/filter-by-email-or-nickname.dto';
import { EntityAlreadyExists, InsufficientCharacters } from '../../error';
import { CreateUserRepository } from '../../repository';
import { FilterByEmailOrNicknameRepository } from '../../repository/user/filter-by-email-or-nickname';
import { Either, left, right } from '../../shared/either';
import { Inject } from '@nestjs/common';

export class CreateUser
  implements UseCase<CreateUserDto, Either<InsufficientCharacters, void>>
{
  constructor(
    @Inject('CreateUserRepository')
    private createUserRepository: CreateUserRepository,
    @Inject('FilterByEmailOrNicknameRepository')
    private filterNicknameRepository: FilterByEmailOrNicknameRepository
  ) {}

  async execute(
    input: CreateUserDto
  ): Promise<Either<InsufficientCharacters, void>> {
    const { name, nickName } = input;

    if (name.length < 3) {
      return left(new InsufficientCharacters('name'));
    }

    if (nickName.length < 3) {
      return left(new InsufficientCharacters('nickName'));
    }

    const filterDto: FilterByEmailOrNicknameDto = {
      nickName: nickName,
    };

    const filterResult = await this.filterNicknameRepository.filter(filterDto);

    if (filterResult.length > 0) {
      return left(new EntityAlreadyExists(nickName));
    }

    await this.createUserRepository.create(input);

    return right(undefined);
  }
}
