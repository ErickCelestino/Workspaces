import { StatusUser } from '../../../type';

export interface EditUserDto {
  id: string;
  name: string;
  birthDate?: Date;
  status: StatusUser;
  loggedUserId: string;
}
