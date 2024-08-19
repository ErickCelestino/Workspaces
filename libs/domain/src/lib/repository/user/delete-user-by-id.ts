import { DeleteUserByIdDto, EditUserDto } from '../../dto';

export interface DeleteUserByIdRepository {
  delete(input: DeleteUserByIdDto): Promise<string>;
}
