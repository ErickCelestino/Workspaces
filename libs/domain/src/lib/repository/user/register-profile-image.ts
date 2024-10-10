import { RegisterProfileImageDto } from '../../dto';

export interface RegisterProfileImageRepository {
  register(input: RegisterProfileImageDto): Promise<string>;
}
