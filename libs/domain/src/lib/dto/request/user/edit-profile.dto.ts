import { BodyUserDto } from './body-user.dto';

export interface EditProfileDto {
  loggedUserId: string;
  body: Omit<BodyUserDto, 'status' | 'type'>;
}
