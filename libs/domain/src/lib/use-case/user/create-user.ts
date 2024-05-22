import { UseCase } from '../../base/use-case';
import { CreateUserDto } from '../../dto';
import {
  CreateError,
  EntityAlreadyExists,
  InsufficientCharacters,
} from '../../error';
import { CreateUserRepository } from '../../repository';
import { FilterByEmailOrNicknameRepository } from '../../repository/user/filter-by-email-or-nickname';
import { Either, left, right } from '../../shared/either';
import { Inject } from '@nestjs/common';

export class CreateUser
  implements
    UseCase<
      CreateUserDto,
      Either<InsufficientCharacters | EntityAlreadyExists, string>
    >
{
  constructor(
    @Inject('CreateUserRepository')
    private createUserRepository: CreateUserRepository,
    @Inject('FilterByEmailOrNicknameRepository')
    private filterNicknameRepository: FilterByEmailOrNicknameRepository
  ) {}

  async execute(
    input: CreateUserDto
  ): Promise<Either<InsufficientCharacters | EntityAlreadyExists, string>> {
    const { name, nickname } = input;

    if (Object.keys(name).length < 1 || name.length < 3) {
      return left(new InsufficientCharacters('name'));
    }
    if (Object.keys(nickname).length < 1 || nickname.length < 3) {
      return left(new InsufficientCharacters('nickName'));
    }

    const filterResult = await this.filterNicknameRepository.filter(nickname);

    if (Object.keys(filterResult).length > 0) {
      return left(new EntityAlreadyExists(nickname));
    }

    const fiterUser = await this.createUserRepository.create(input);

    if (Object.keys(fiterUser).length < 1) {
      return left(new CreateError('User'));
    }

    return right(fiterUser);
  }
}
