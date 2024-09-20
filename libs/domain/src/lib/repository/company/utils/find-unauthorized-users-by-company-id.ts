import { FindUnauthorizedUsersByCompanyIdDto } from '../../../dto';
import { UserList } from '../../../entity';

export interface FindUnauthorizedUsersByCompanyIdRepository {
  find(input: FindUnauthorizedUsersByCompanyIdDto): Promise<UserList[]>;
}
