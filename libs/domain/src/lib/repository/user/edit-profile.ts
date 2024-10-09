import { EditProfileDto } from '../../dto';

export interface EditProfileRepository {
  edit(input: EditProfileDto): Promise<string>;
}
