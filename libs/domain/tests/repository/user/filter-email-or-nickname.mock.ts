import { FilterByEmailOrNicknameDto } from '../../../src/lib/dto/user/filter-by-email-or-nickname.dto';
import { User } from '../../../src/lib/entity';
import { FilterByEmailOrNicknameRepository } from '../../../src/lib/repository/user/filter-by-email-or-nickname';

export class FilterByEmailOrNicknameRepositoryMock
  implements FilterByEmailOrNicknameRepository
{
  filterEmailOrNickname: FilterByEmailOrNicknameDto = {};

  async filter(input: FilterByEmailOrNicknameDto): Promise<User[]> {
    this.filterEmailOrNickname = input;
    return [];
  }
}
