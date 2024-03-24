import { CreateUserDto } from '../../dto';

export interface CreateUserRepository {
  create(input: CreateUserDto): Promise<void>;
}
