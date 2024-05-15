import { User, UserList } from '../../entity';

export interface FindUserByIdRepository {
  find(id: string): Promise<UserList>;
}
