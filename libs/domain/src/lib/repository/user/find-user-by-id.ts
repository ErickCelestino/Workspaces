import { User } from '../../entity';

export interface FindUserByIdRepository {
  find(id: string): Promise<User>;
}
