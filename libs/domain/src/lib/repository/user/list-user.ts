import { UserList } from '../../entity';

export interface ListUserRepository {
  list(input: string): Promise<UserList[]>;
}
