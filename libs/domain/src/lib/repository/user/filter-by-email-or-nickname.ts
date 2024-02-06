import { FilterByEmailOrNicknameDto } from '../../dto/user/filter-by-email-or-nickname.dto';
import { User } from '../../entity';

export interface FilterByEmailOrNicknameRepository {
  filter(input: FilterByEmailOrNicknameDto): Promise<User[]>;
}
