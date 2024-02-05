import { CreateUserDto } from '../../dtos';

export interface CreateUserRepository {
  create(input: CreateUserDto): Promise<void>;
}
