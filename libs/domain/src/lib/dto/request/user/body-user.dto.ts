import { StatusUser } from '../../../type';

export interface BodyUserDto {
  id: string;
  name: string;
  birthDate?: Date;
  status: StatusUser;
  type: string;
}
